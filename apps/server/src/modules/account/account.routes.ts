import { Elysia, NotFoundError } from 'elysia';

import { config } from '@/config';
import { BadRequestError } from '@/errors/bad-request';
import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { security } from '@/plugins/security';
import { Cookie } from '@/schemas/cookie';
import { type IPayload } from '@/schemas/payload';
import { AccountService } from '@/modules/account/account.service';
import { SessionService } from '@/modules/session/session.service';
import { NotificationService } from '@/modules/notification/notification.service';
import {
  RegisterBody,
  RegisterResponse,
} from '@/modules/account/schemas/routes/register';
import {
  LoginBody,
  LoginResponse,
} from '@/modules/account/schemas/routes/login';
import { GetAccountResponse } from '@/modules/account/schemas/routes/get-account';
import { LogoutResponse } from '@/modules/account/schemas/routes/logout';
import {
  UpdateAccountBody,
  UpdateAccountResponse,
} from '@/modules/account/schemas/routes/update-account';

const logger = getLogger('Accounts');

export const accounts = new Elysia({
  prefix: '/accounts',
  tags: ['Учётные записи'],
})
  .use(jsonwebtokens)
  .guard({ cookie: Cookie })
  .resolve(async ({ cookie, ajwt, rjwt }) => {
    async function setCookies(payload: IPayload) {
      cookie['access_token'].set({
        value: await ajwt.sign(payload),
        maxAge: config.ajwt.expires,
      });
      cookie['refresh_token'].set({
        value: await rjwt.sign(payload),
        maxAge: config.rjwt.expires,
      });

      return cookie['refresh_token'].value!;
    }

    return { setCookies };
  })
  .post(
    '/users/auth/register',
    async ({ setCookies, body, set }) => {
      try {
        const account = await AccountService.register(body);

        const token = await setCookies({
          id: account.id,
          roles: account.roles,
        });

        await SessionService.createSession(account.id, token);

        await NotificationService.createNotification(account.id, {
          title: 'Добро пожаловать!',
          content: 'Рады видеть Вас! Спасибо, что используете это приложение!',
          link: null,
        });

        const message = `User with ID ${account.id} has been successfully created`;

        logger.info(message);

        return account;
      } catch (error) {
        if (error instanceof BadRequestError) {
          const message = error.message;

          logger.warn(message);

          set.status = 400;
          throw new Error(message);
        }

        const message = 'An error occurred when registering the user';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      body: RegisterBody,
      response: response(RegisterResponse),
      detail: {
        summary: 'Регистрация учётной записи',
        description:
          'Регистрирует новую учётную запись пользователя, записывает токены доступа и обновления в cookie',
      },
    },
  )
  .post(
    '/users/auth/login',
    async ({ setCookies, body, set }) => {
      try {
        const account = await AccountService.login(body);

        const token = await setCookies({
          id: account.id,
          roles: account.roles,
        });

        await SessionService.createSession(account.id, token);

        const message = `User with ID ${account.id} has successfully logged in`;

        logger.info(message);

        return account;
      } catch (error) {
        if (error instanceof BadRequestError) {
          const message = error.message;

          logger.warn(message);

          set.status = 400;
          throw new Error(message);
        }

        const message = 'An error occurred when authorizing the user';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      body: LoginBody,
      response: response(LoginResponse),
      detail: {
        summary: 'Вход в учётную запись',
        description:
          'Проверяет учётные данные пользователя, записывает токены доступа и обновления в cookie',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/users/me',
        async ({ account, set }) => {
          try {
            const profile = await AccountService.getAccountById(account.id);

            const message = `User with the ID ${account.id} received successfully`;

            logger.info(message);

            return profile;
          } catch (error) {
            if (error instanceof NotFoundError) {
              const message = error.message;

              logger.warn(message);

              set.status = 404;
              throw new Error(message);
            }

            const message = 'An error occurred when receiving the user';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(GetAccountResponse),
          detail: {
            summary: 'Профиль пользователя',
            description:
              'Возвращает данные профиля авторизованного пользователя',
          },
        },
      )
      .post(
        '/users/auth/logout',
        async ({ account, cookie, set }) => {
          try {
            await SessionService.deleteSessionByToken(
              cookie['refresh_token'].value!,
            );

            cookie['access_token'].remove();
            cookie['refresh_token'].remove();

            const message = `User with the ID ${account.id} logged out successfully`;

            logger.info(message);

            return message;
          } catch {
            const message = 'An error occurred when the user logged out';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(LogoutResponse),
          detail: {
            summary: 'Выход из учётной записи',
            description:
              'Удаляет текущую сессию, удаляет токены доступа и обновления из cookie',
          },
        },
      )
      .put(
        '/users/settings',
        async ({ account: { id }, body, set }) => {
          try {
            const account = AccountService.updateAccount(id, body);

            const message = `Account with the ID ${id} has been successfully updated`;

            logger.info(message);

            return account;
          } catch {
            const message = 'An error occurred when updating the account';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          body: UpdateAccountBody,
          response: response(UpdateAccountResponse),
          detail: {
            summary: 'Обновить настройки аккаунта',
            description: 'Обновляет настройки аккаунта пользователя',
          },
        },
      ),
  );
