export type Toolbar = {
  close(): void;
  open(): void;
  toggleBlockSettings(openingState?: boolean): void;
  toggleToolbox(openingState?: boolean): void;
};
