import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Shop } from '../../../../models/shop.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-shop-modal',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './shop-modal.component.html',
  styleUrl: './shop-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModalComponent implements OnChanges {
  @Input() shop!: Shop;
  @Output() closed = new EventEmitter<void>();
  @Output() proceedToOrder = new EventEmitter<Shop>();

  activeGalleryIndex = 0;
  isSaved = false;

  readonly todayIndex = [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];

  private readonly platformId = inject(PLATFORM_ID);

  constructor(private _toastService: ToastService, private _cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shop']) {
      this.activeGalleryIndex = 0;
    }
  }

  get activeCoverGradient(): string {
    return this.shop?.gallery[this.activeGalleryIndex] ?? this.shop?.gradient ?? '';
  }

  selectGallery(index: number): void {
    this.activeGalleryIndex = index;
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
    this._toastService.show(
      this.isSaved ? 'Shop saved to favourites!' : 'Removed from favourites.',
      this.isSaved ? 'success' : 'info'
    );
    this._cdr.markForCheck();
  }

  share(): void {
    if (isPlatformBrowser(this.platformId) && navigator.share) {
      navigator.share({ title: this.shop.name, text: this.shop.tagline })
        .then(() => this._toastService.show('Shared successfully!', 'success'))
        .catch(() => {});
    } else {
      this._toastService.show('Share link copied!', 'info');
    }
  }

  call(): void { this._toastService.show('Calling...', 'info'); }
  openWA(): void { this._toastService.show('Opening WhatsApp...', 'success'); }
  sendEmail(): void { this._toastService.show('Opening email...', 'info'); }
  openMap(): void { this._toastService.show('Opening map...', 'info'); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement) === event.currentTarget) {
      this.closed.emit();
    }
  }

  onProceed(): void {
    this.proceedToOrder.emit(this.shop);
  }
}