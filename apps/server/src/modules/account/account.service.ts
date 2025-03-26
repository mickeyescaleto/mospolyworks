import { InternalServerError } from 'elysia';

import { config } from '@/config';
import { BadRequestError } from '@/errors/bad-request';
import { parseExternalAccount } from '@/utilities/parse-external-account';
import { UserService } from '@/modules/user/user.service';
import { type ExternalAccountBody } from '@/modules/account/schemas/external-account';

export abstract class AccountService {
  static async getExternalAccount(body: ExternalAccountBody) {
    const { token } = await fetch(config.external.endpoint, {
      method: 'POST',
      body: Object.entries({
        ulogin: body.login,
        upassword: body.password,
      }).reduce((f, [k, v]) => (f.append(k, v), f), new FormData()),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      if (response.status === 400) {
        throw new BadRequestError('Invalid login or password');
      }

      throw new InternalServerError('Internal Server Error');
    });

    const { user } = await fetch(
      `${config.external.endpoint}/?getUser&token=${token}`,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new InternalServerError('Internal Server Error');
    });

    const externalAccountData = await parseExternalAccount({
      token,
      user: {
        ...user,
        ...body,
      },
    });

    return externalAccountData;
  }

  static async actualizeAccountData(userId: string) {
    const { roles, externalToken } = await UserService.getUserById(userId);

    const { user } = await fetch(
      `${config.external.endpoint}/?getUser&token=${externalToken}`,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new InternalServerError('Internal Server Error');
    });

    const externalAccountData = await parseExternalAccount({
      token: externalToken,
      user,
    });

    if (roles.includes('ADMIN')) {
      externalAccountData.roles.push('ADMIN');
    }

    return externalAccountData;
  }
}
