import { Component } from '@angular/core';
import { PrintService } from '../../../core/services/print.service';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent {
  uploadedFiles = this._printService.files;

  constructor(private _printService: PrintService) {
    
  }
  onSelectedFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._printService.addFiles(input.files || []);
  }

  getFileSizeInMB(sizeInBytes: number): string{
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
