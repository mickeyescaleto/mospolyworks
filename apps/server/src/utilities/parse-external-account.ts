import { type Role } from '@/modules/user/schemas/role';
import { type CreateUserBody } from '@/modules/user/schemas/create-user';
import {
  type ExternalAccount,
  type ExternalAccountBody,
} from '@/modules/account/schemas/external-account';

type ParseExternalAccountProps = {
  token: string;
  user: ExternalAccount & Omit<ExternalAccountBody, 'password'>;
};

export const parseExternalAccount = async (
  data: ParseExternalAccountProps,
): Promise<CreateUserBody> => {
  const roles: Role[] =
    data.user['user_status'] === 'stud' ? ['STUDENT'] : ['STAFF'];

  const parsedAccountData: CreateUserBody = {
    name: data.user.name,
    surname: data.user.surname,
    patronymic: data.user.patronymic,
    login: data.user.login,
    avatar: data.user.avatar,
    group: data.user.group,
    course: data.user.course,
    faculty: data.user.faculty,
    specialty: data.user.specialty,
    specialization: data.user.specialization,
    externalToken: data.token,
    roles,
  };

  return parsedAccountData;
};
