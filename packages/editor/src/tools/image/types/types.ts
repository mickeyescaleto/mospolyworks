import type { HTMLPasteEventDetail } from '@repo/editor/types/tools/paste-events';

export type UploadOptions = {
  onPreview: (src: string) => void;
};

export type ActionConfig = {
  name: string;
  icon: string;
  title: string;
  toggle?: boolean;
  action?: Function;
};

export type UploadResponseFormat<AdditionalFileData = {}> = {
  success: number;
  file: {
    url: string;
  } & AdditionalFileData;
};

export type ImageToolData<Actions = {}, AdditionalFileData = {}> = {
  withBorder: boolean;
  withBackground: boolean;
  roundedCorners: boolean;
  file: {
    url: string;
  } & AdditionalFileData;
} & (Actions extends Record<string, boolean> ? Actions : {});

export type FeaturesConfig = {
  background?: boolean;
  border?: boolean;
  round?: boolean;
};

export type ImageConfig = {
  endpoints: {
    byFile?: string;
    byUrl?: string;
  };
  field?: string;
  types?: string;
  additionalRequestData?: object;
  additionalRequestHeaders?: object;
  buttonContent?: string;
  uploader?: {
    uploadByFile?: (file: Blob) => Promise<UploadResponseFormat>;
    uploadByUrl?: (url: string) => Promise<UploadResponseFormat>;
  };
  actions?: ActionConfig[];
  features?: FeaturesConfig;
};

export type HTMLPasteEventDetailExtended = HTMLPasteEventDetail & {
  data: {
    src: string;
  } & HTMLElement;
};

export type ImageSetterParam = {
  url: string;
};
