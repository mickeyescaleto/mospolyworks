export type HTMLPasteEventDetail = {
  data: HTMLElement;
};

export type HTMLPasteEvent = CustomEvent & {
  readonly detail: HTMLPasteEventDetail;
};

export type FilePasteEventDetail = {
  file: File;
};

export type FilePasteEvent = CustomEvent & {
  readonly detail: FilePasteEventDetail;
};

export type PatternPasteEventDetail = {
  key: string;
  data: string;
};

export type PatternPasteEvent = CustomEvent & {
  readonly detail: PatternPasteEventDetail;
};

export type PasteEvent = HTMLPasteEvent | FilePasteEvent | PatternPasteEvent;

export type PasteEventDetail =
  | HTMLPasteEventDetail
  | FilePasteEventDetail
  | PatternPasteEventDetail;
