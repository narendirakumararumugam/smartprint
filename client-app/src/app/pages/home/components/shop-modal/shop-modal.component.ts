import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Shop } from '../../../../models/shop.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { ShopService } from '../../../../core/services/shop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-modal',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './shop-modal.component.html',
  styleUrl: './shop-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModalComponent implements OnChanges, OnDestroy {
  @Input() shop!: Shop;
  @Output() closed = new EventEmitter<void>();
  @Output() proceedToOrder = new EventEmitter<Shop>();

  activeGalleryIndex = 0;
  isSaved = false;
  isLoadingDetail = false;
  displayShop!: Shop;

  readonly todayIndex = [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];

  private readonly platformId = inject(PLATFORM_ID);
  private detailSub?: Subscription;

  constructor(private _toastService: ToastService, private _cdr: ChangeDetectorRef, private shopService: ShopService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shop'] && this.shop) {
      this.activeGalleryIndex = 0;

      this.displayShop = this.shop;
      this.isLoadingDetail = true;
      this._cdr.markForCheck();
      this.detailSub?.unsubscribe();
      this.detailSub = this.shopService.getShopDetail(this.shop.id).subscribe({
        next: (detail) => {
          this.displayShop = {
            ...detail, distance: this.shop.distance || detail.distance,
            distanceKm: this.shop.distanceKm ?? detail.distanceKm,
          };
          this.isLoadingDetail = false;
          this._cdr.markForCheck();
        },
        error: () => {
          this.displayShop = this.shop;
          this.isLoadingDetail = false;
          this._cdr.markForCheck();
        }
      });
    }
  }

  ngOnDestroy(): void{
    this.detailSub?.unsubscribe();
  }

  get activeCoverGradient(): string {
    return this.displayShop?.gallery?.[this.activeGalleryIndex] ?? this.displayShop?.gradient ?? '';
  }

  get extraGalleryCount(): number{
    return Math.max(0, (this.displayShop?.gallery?.length ?? 0) - 4);
  }

  selectGallery(index: number): void {
    this.activeGalleryIndex = index;
    this._cdr.markForCheck();
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
      navigator.share({ title: this.displayShop.name, text: this.displayShop.tagline })
        .then(() => this._toastService.show('Shared successfully!', 'success'))
        .catch(() => {});
    } else {
      this._toastService.show('Share link copied!', 'info');
    }
  }

  call(): void { this._toastService.show('Calling...', 'info'); }
  sendEmail(): void { this._toastService.show('Opening email...', 'info'); }
  openMap(): void { this._toastService.show('Opening map...', 'info'); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement) === event.currentTarget) {
      this.closed.emit();
    }
  }

  onProceed(): void {
    this.proceedToOrder.emit(this.displayShop);
  }
}