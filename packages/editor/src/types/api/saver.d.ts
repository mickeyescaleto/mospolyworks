import type { OutputData } from '@/types/data-formats/output-data';

export type Saver = {
  save(): Promise<OutputData>;
};
