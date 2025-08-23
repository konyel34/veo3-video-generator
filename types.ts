
export type AspectRatio = '16:9' | '9:16';

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64Data: string;
  mimeType: string;
}
