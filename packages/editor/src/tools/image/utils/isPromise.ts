import type { UploadResponseFormat } from '../types/types';

export default function isPromise(
  object: Promise<UploadResponseFormat>,
): object is Promise<UploadResponseFormat> {
  return object !== undefined && typeof object.then === 'function';
}
