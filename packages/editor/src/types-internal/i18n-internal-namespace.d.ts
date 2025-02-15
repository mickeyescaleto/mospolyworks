type Indexed<T> = { [key: string]: T };

export type LeavesDictKeys<D> = D extends string
  ? D
  : D extends Indexed<string>
    ? keyof D
    : D extends Indexed<any>
      ? { [K in keyof D]: LeavesDictKeys<D[K]> }[keyof D]
      : never;

export type DictNamespaces<D extends object> = {
  [K in keyof D]: D[K] extends Indexed<string>
    ? string
    : D[K] extends Indexed<any>
      ? DictNamespaces<D[K]>
      : never;
};
