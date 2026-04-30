import { SafeUrl } from "@angular/platform-browser";

export interface UploadedFileDetails {
  name: string;
  size: string;
  progress: number;
  thumbnailUrl: string | SafeUrl;
  icon: string;
  settings: {
    pages: string;
    customPages?: string;
    layout: string;
    color: string;
  };
}