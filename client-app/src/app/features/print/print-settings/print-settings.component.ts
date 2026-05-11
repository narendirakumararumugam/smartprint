import { Component, effect, signal } from '@angular/core';
import { PrintService } from '../../../core/services/print.service';
import { PrintFileConfigComponent } from '../print-file-config/print-file-config.component';
import { PrintFileConfig } from '../../../models/print/print-file-config';

@Component({
  selector: 'app-print-settings',
  standalone: true,
  imports: [PrintFileConfigComponent],
  templateUrl: './print-settings.component.html',
  styleUrl: './print-settings.component.css',
})
export class PrintSettingsComponent {
  addonList = [
    { icon: 'bxf bx-shutter-alt', name: 'Spiral binding', price: 30 },
    { icon: 'bxf bx-book', name: 'Hard binding', price: 180 },
    { icon: 'bxf bx-shutter-alt', name: 'Lamination A4', price: 15 },
    { icon: 'bxf bx-shutter-alt', name: 'Lamination A4', price: 25 },
    { icon: 'bxf bx-shutter-alt', name: 'Photo print', price: 15 },
  ];

  filenames: string[] = [];

  selectedFile = signal<string>('');
  selectedPrintFileConfig!: PrintFileConfig;

  constructor(private _printService: PrintService) {
    this.init();
    effect(() => {
      this.selectedPrintFileConfig = this._printService
        .printFilesConfig()
        .filter((config) => config.name == this.selectedFile())[0];
    });
  }

  init(): void {
    this.filenames = this.getFilenames(this._printService.files());
    this.selectedFile.set(this.filenames[0]);
    this.selectedPrintFileConfig = this._printService
      .printFilesConfig()
      .filter((config) => config.name == this.selectedFile())[0];
  }

  getFilenames(fileList: File[]): string[] {
    return fileList.map((file) => file.name);
  }

  setSelectedFile(filename: string): void {
    this.selectedFile.set(filename);
  }
}
