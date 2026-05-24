import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { UploadedFile } from '../../../../models/upload.model';
import {
  fileIconBgClass,
  fileIconBxClass,
} from '../../../../utils/pricing.utils';

@Component({
  selector: 'app-upload-file-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file-drop.component.html',
  styleUrl: './upload-file-drop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileDropComponent {
  @Input() files: UploadedFile[] = [];
  @Output() filesAdded = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<number>();

  @ViewChild('fileInputRef')
  private fileInputRef?: ElementRef<HTMLInputElement>;

  isDragOver = false;

  readonly fileIconBg = fileIconBgClass;
  readonly fileIconBx = fileIconBxClass;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  openFilePicker(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fileInputRef?.nativeElement.click();
    }
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
    this.cdr.markForCheck();
  }

  onDragLeave(): void {
    this.isDragOver = false;
    this.cdr.markForCheck();
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    if (e.dataTransfer?.files) {
      this.filesAdded.emit(Array.from(e.dataTransfer.files));
    }
    this.cdr.markForCheck();
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.filesAdded.emit(Array.from(input.files));
      input.value = '';
    }
  }

  trackById(_: number, f: UploadedFile): number {
    return f.id;
  }
}
