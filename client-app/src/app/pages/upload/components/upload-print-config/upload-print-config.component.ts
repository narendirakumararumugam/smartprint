import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PrintAddon, UploadedFile } from '../../../../models/upload.model';
import {
  DropdownComponent,
  DropdownOption,
} from '../../../../shared/components/dropdown/dropdown.component';
import { estimateFile, estimateTotal } from '../../../../utils/pricing.utils';

export interface FileConfigChange {
  index: number;
  key: string;
  value: unknown;
}

@Component({
  selector: 'app-upload-print-config',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './upload-print-config.component.html',
  styleUrl: './upload-print-config.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPrintConfigComponent {
  @Input() files: UploadedFile[] = [];
  @Input() activeIndex = 0;
  @Input() addons: PrintAddon[] = [];
  @Input() selectedAddons = new Set<string>();
  @Output() fileConfigChange = new EventEmitter<FileConfigChange>();
  @Output() activeIndexChange = new EventEmitter<number>();
  @Output() addonToggle = new EventEmitter<string>();

  readonly estimateFile = estimateFile;

  readonly paperSizeOptions: DropdownOption[] = [
    { label: 'A4 (Standard)', value: 'A4', icon: 'bx bx-file' },
    { label: 'A3 (Large)', value: 'A3', icon: 'bx bx-expand' },
    { label: 'A5 (Small)', value: 'A5', icon: 'bx bx-file-blank' },
    { label: 'Letter (US)', value: 'Letter', icon: 'bx bx-news' },
  ];

  readonly orientationOptions: DropdownOption[] = [
    {
      label: 'Portrait (Auto-detect)',
      value: 'Portrait',
      icon: 'bx bx-mobile',
    },
    { label: 'Landscape', value: 'Landscape', icon: 'bx bx-mobile-landscape' },
  ];

  get currentFile(): UploadedFile | null {
    return this.files[this.activeIndex] ?? null;
  }

  get selectedAddonsList(): PrintAddon[] {
    return Array.from(this.selectedAddons)
      .map((id) => this.addons.find((a) => a.id === id)!)
      .filter(Boolean);
  }

  get totalPrice(): number {
    return estimateTotal(this.files, this.selectedAddons, this.addons);
  }

  setCfg(key: string, value: unknown): void {
    this.fileConfigChange.emit({ index: this.activeIndex, key, value });
  }

  trackByFileId(_: number, f: UploadedFile): number {
    return f.id;
  }
  trackByAddonId(_: number, a: PrintAddon): string {
    return a.id;
  }
}
