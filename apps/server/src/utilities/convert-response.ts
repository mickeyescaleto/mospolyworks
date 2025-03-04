import { TSchema } from 'elysia';
import { Value } from '@sinclair/typebox/value';
import { Static } from '@sinclair/typebox';

export const convertResponse = <T extends TSchema>(
  response: unknown,
  scheme: T,
): Static<T> => {
  const isValid = Value.Check(scheme, response);

  if (!isValid) {
    throw new Error('The response cannot be converted');
  }

  const data = Value.Parse(scheme, response);

  return data;
};
