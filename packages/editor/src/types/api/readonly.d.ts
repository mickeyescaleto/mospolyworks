export type ReadOnly = {
  toggle(state?: boolean): Promise<boolean>;
  isEnabled: boolean;
};
