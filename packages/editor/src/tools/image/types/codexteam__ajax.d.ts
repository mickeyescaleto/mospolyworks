declare module '@codexteam/ajax' {
  export type AjaxOptions = {
    url?: string;
    data?: object;
    accept?: string;
    headers?: object;
    beforeSend?: (files: File[]) => void;
    fieldName?: string;
    type?: string;
  };

  export type AjaxFileOptionsParam = {
    accept: string;
  };

  export interface AjaxResponse<T = object> {
    body: T;
  }

  export function selectFiles(options: AjaxFileOptionsParam): Promise<File[]>;

  export function transport(options: AjaxOptions): Promise<AjaxResponse>;

  export function post(options: AjaxOptions): Promise<AjaxResponse>;

  export const contentType: {
    JSON: string;
  };
}
