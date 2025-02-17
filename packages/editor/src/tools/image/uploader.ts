import ajax from '@codexteam/ajax';
import type { AjaxResponse } from '@codexteam/ajax';
import isPromise from './utils/isPromise';

import type { UploadOptions } from './types/types';
import type { UploadResponseFormat, ImageConfig } from './types/types';

type UploaderParams = {
  config: ImageConfig;
  onUpload: (response: UploadResponseFormat) => void;
  onError: (error: string) => void;
};

export default class Uploader {
  private config: ImageConfig;
  private onUpload: (response: UploadResponseFormat) => void;
  private onError: (error: string) => void;

  constructor({ config, onUpload, onError }: UploaderParams) {
    this.config = config;
    this.onUpload = onUpload;
    this.onError = onError;
  }

  public uploadSelectedFile({ onPreview }: UploadOptions): void {
    const preparePreview = function (file: File): void {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => {
        onPreview((e.target as FileReader).result as string);
      };
    };

    let upload: Promise<UploadResponseFormat>;

    if (
      this.config.uploader &&
      typeof this.config.uploader.uploadByFile === 'function'
    ) {
      const uploadByFile = this.config.uploader.uploadByFile;

      upload = ajax
        .selectFiles({ accept: this.config.types ?? 'image/*' })
        .then((files: File[]) => {
          preparePreview(files[0]);

          const customUpload = uploadByFile(files[0]);

          if (!isPromise(customUpload)) {
            console.warn(
              'Custom uploader method uploadByFile should return a Promise',
            );
          }

          return customUpload;
        });
    } else {
      upload = ajax
        .transport({
          url: this.config.endpoints.byFile,
          data: this.config.additionalRequestData,
          accept: this.config.types ?? 'image/*',
          headers: this.config.additionalRequestHeaders as Record<
            string,
            string
          >,
          beforeSend: (files: File[]) => {
            preparePreview(files[0]);
          },
          fieldName: this.config.field ?? 'file',
        })
        .then(
          (response: AjaxResponse) => response.body as UploadResponseFormat,
        );
    }

    upload
      .then((response) => {
        this.onUpload(response);
      })
      .catch((error: string) => {
        this.onError(error);
      });
  }

  public uploadByUrl(url: string): void {
    let upload;

    if (
      this.config.uploader &&
      typeof this.config.uploader.uploadByUrl === 'function'
    ) {
      upload = this.config.uploader.uploadByUrl(url);

      if (!isPromise(upload)) {
        console.warn(
          'Custom uploader method uploadByUrl should return a Promise',
        );
      }
    } else {
      upload = ajax
        .post({
          url: this.config.endpoints.byUrl,
          data: Object.assign(
            {
              url: url,
            },
            this.config.additionalRequestData,
          ),
          type: ajax.contentType.JSON,
          headers: this.config.additionalRequestHeaders as Record<
            string,
            string
          >,
        })
        .then(
          (response: AjaxResponse) => response.body as UploadResponseFormat,
        );
    }

    upload
      .then((response: UploadResponseFormat) => {
        this.onUpload(response);
      })
      .catch((error: string) => {
        this.onError(error);
      });
  }

  public uploadByFile(file: Blob, { onPreview }: UploadOptions): void {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      onPreview((e.target as FileReader).result as string);
    };

    let upload: Promise<UploadResponseFormat>;

    if (
      this.config.uploader &&
      typeof this.config.uploader.uploadByFile === 'function'
    ) {
      upload = this.config.uploader.uploadByFile(file);

      if (!isPromise(upload)) {
        console.warn(
          'Custom uploader method uploadByFile should return a Promise',
        );
      }
    } else {
      const formData = new FormData();

      formData.append(this.config.field ?? 'file', file);

      if (
        this.config.additionalRequestData &&
        Object.keys(this.config.additionalRequestData).length
      ) {
        Object.entries(this.config.additionalRequestData).forEach(
          ([name, value]: [string, string | Blob]) => {
            formData.append(name, value);
          },
        );
      }

      upload = ajax
        .post({
          url: this.config.endpoints.byFile,
          data: formData,
          type: ajax.contentType.JSON,
          headers: this.config.additionalRequestHeaders as Record<
            string,
            string
          >,
        })
        .then(
          (response: AjaxResponse) => response.body as UploadResponseFormat,
        );
    }

    upload
      .then((response) => {
        this.onUpload(response);
      })
      .catch((error: string) => {
        this.onError(error);
      });
  }
}
