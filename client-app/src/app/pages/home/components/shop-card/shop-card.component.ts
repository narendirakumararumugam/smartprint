import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { Shop } from '../../../../models/shop.model';
import { ShopService } from '../../../../core/services/shop.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './shop-card.component.html',
  styleUrl: './shop-card.component.css',
})
export class ShopCardComponent {
  @Input() shop!: Shop;
  @Input() animationDelay = 0;
  @Output() viewDetail = new EventEmitter<Shop>();

  savedSet = new Set<number>();

  constructor(
    public _shopService: ShopService,
    private _toastService: ToastService,
  ) {}

  get visibleServices(): string[] {
    if (this.shop.services) {
      return this.shop.services.slice(0, 3);
    }
    return [];
  }

  get extraServicesCount(): number {
    if (this.shop.services) {
      return this.shop.services.length - 3;
    }
    return 0;
  }

  isSaved(id: number): boolean {
    return this.savedSet.has(id);
  }

  toggleSave(event: MouseEvent): void {
    event.stopPropagation();
    if (this.savedSet.has(this.shop.id)) {
      this.savedSet.delete(this.shop.id);
      this._toastService.show('Removed from favourites.', 'info');
    } else {
      this.savedSet.add(this.shop.id);
      this._toastService.show(
        `${this.shop.name} saved to favourites!`,
        'success',
      );
    }
  }

  badgeClass(badge: string): string {
    if (badge === '#1 in Area' || badge === 'Top Rated') return 'badge b-top';
    if (badge === 'Student Discount') return 'badge b-new';
    return 'badge b-blue';
  }
}
