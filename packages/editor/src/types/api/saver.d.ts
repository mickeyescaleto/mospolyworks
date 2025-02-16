import type { OutputData } from '@repo/editor/types/data-formats/output-data';

export type Saver = {
  save(): Promise<OutputData>;
};
