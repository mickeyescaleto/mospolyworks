export type MoveEventDetail = {
  fromIndex: number;
  toIndex: number;
};

export type MoveEvent = CustomEvent & {
  readonly detail: MoveEventDetail;
};
