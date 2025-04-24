import { TSchema } from 'elysia';

export function response<S extends TSchema>(schema: S): S {
  schema.description =
    'Ответ отформатирован с помощью SuperJSON (включает метаданные возвращаемого типа)';

  return schema;
}
