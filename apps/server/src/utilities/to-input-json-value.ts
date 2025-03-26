import { Prisma } from '@repo/database';

export function toInputJsonValue(
  value: Prisma.JsonValue,
): Prisma.InputJsonValue {
  if (!value) {
    throw new Error('Value cannot be null or undefined');
  }

  return value as Prisma.InputJsonValue;
}
