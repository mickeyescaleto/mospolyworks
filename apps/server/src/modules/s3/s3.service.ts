import { S3Client } from 'bun';

import { config } from '@/config';

export abstract class S3Service {
  private static readonly client = new S3Client({
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    endpoint: config.s3.endpoint,
    bucket: config.s3.bucket,
    region: config.s3.region,
  });

  private static generateFilename(filename: string): string {
    const symbols = Math.random().toString(36).substring(2, 16);

    const format = filename.split('.').at(-1);

    return `${Date.now()}-${symbols}.${format}`;
  }

  static async save(file: File, directory?: string): Promise<string> {
    const filename: string = this.generateFilename(file.name);

    const path: string = directory ? `${directory}/${filename}` : filename;

    const exists = await this.client.exists(path);

    if (exists) {
      throw new Error('The file already exists');
    }

    const status = await this.client.write(path, file);

    if (!status) {
      throw new Error('File writing error');
    }

    const url: string = `${config.s3.domain}/${path}`;

    return url;
  }
}
