import { SafeUrl } from "@angular/platform-browser";

export interface PrintFile {
  name: string;
  thumbnail: SafeUrl; // Mock preview image
  settings: {
    pages: string;
    customPages?: string;
    layout: 'Portrait' | 'Landscape';
    color: 'B&Black & White' | 'Color';
  };
}