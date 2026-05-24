import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  PrintAddon,
  PrintShop,
  UploadedFile,
} from '../../../../models/upload.model';

@Component({
  selector: 'app-upload-order-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-order-review.component.html',
  styleUrl: './upload-order-review.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadOrderReviewComponent {
  @Input() shop: PrintShop | null = null;
  @Input() files: UploadedFile[] = [];
  @Input() addons: PrintAddon[] = [];
  @Input() selectedAddons = new Set<string>();
  @Input() totalPrice = 0;
  @Input() totalPages = 0;
  @Input() specialNote = '';
  @Output() specialNoteChange = new EventEmitter<string>();

  get totalAddonsLabel(): string {
    const names = Array.from(this.selectedAddons)
      .map((id) => this.addons.find((a) => a.id === id)?.name)
      .filter(Boolean);
    return names.length ? (names as string[]).join(',') : 'None';
  }

  trackByFileId(_: number, f: UploadedFile): number {
    return f.id;
  }
}
