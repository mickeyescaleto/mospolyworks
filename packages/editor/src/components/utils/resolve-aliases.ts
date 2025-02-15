export function resolveAliases<ObjectType>(
  obj: ObjectType,
  aliases: { [alias: string]: string },
): ObjectType {
  const result = {} as ObjectType;

  Object.keys(obj).forEach((property) => {
    const aliasedProperty = aliases[property];

    if (aliasedProperty !== undefined) {
      result[aliasedProperty] = obj[property];
    } else {
      result[property] = obj[property];
    }
  });

  return result;
}
