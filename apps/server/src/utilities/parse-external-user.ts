import { Prisma } from '@repo/database';

import {
  tExternalUser,
  tExternalUserCredentials,
} from '@/modules/user/schemas/external-user';
import { tRole } from '@/modules/user/schemas/role';

type ParseExternalUserProps = {
  token: string;
  user: typeof tExternalUser.static & typeof tExternalUserCredentials.static;
};

export const parseExternalUser = async (
  data: ParseExternalUserProps,
): Promise<Prisma.UserCreateInput> => {
  const password = await Bun.password.hash(data.user.password, 'bcrypt');

  const roles: (typeof tRole.static)[] =
    data.user['user_status'] === 'stud' ? ['STUDENT'] : ['STAFF'];

  const parsedData: Prisma.UserCreateInput = {
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
    password,
    roles,
  };

  return parsedData;
};
