import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
  ChangeDetectorRef,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Shop } from '../../models/shop.model';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';
import { LocationService } from '../../core/services/location.service';
import { environment } from '../../environment/environment';
import { MESSAGES } from '../../core/constants/messages';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ShopModalComponent } from './components/shop-modal/shop-modal.component';
import { ShopsMapComponent } from '../../shared/components/shops-map/shops-map.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { ShopCardComponent } from './components/shop-card/shop-card.component';
import { FeaturedCardComponent } from './components/featured-card/featured-card.component';
import { FilterStripComponent } from './components/filter-strip/filter-strip.component';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ToastContainerComponent,
    ShopModalComponent,
    CommonModule,
    ShopsMapComponent,
    SkeletonCardComponent,
    ShopCardComponent,
    FeaturedCardComponent,
    FilterStripComponent,
    HeroComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroRef') heroRef!: ElementRef<HTMLElement>;

  shops$!: Observable<Shop[]>;
  featuredShops: Shop[] = [];
  skeletons = Array(6);

  isLoading = true;
  selectedShop: Shop | null = null;
  isModalOpen = false;
  viewMode: 'grid' | 'map' = 'grid';

  setViewMode(mode: 'grid' | 'map'): void {
    this.viewMode = mode;
    this.cdr.markForCheck();
  }

  private heroObserver?: IntersectionObserver;
  private sub!: Subscription;

  private readonly shopService = inject(ShopService);
  private readonly toastService = inject(ToastService);
  private readonly locationService = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.shops$ = this.shopService.filteredShops$;
    this.featuredShops = this.shopService.getFeatured();

    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
      if (environment.useMockData) {
        const loc = this.locationService.currentLocation;
        const area = loc?.shortAddress ?? 'Connaught Place, Delhi';
        this.toastService.show(MESSAGES.SHOPS.FOUND(245, area), 'success');
      }
    }, 900);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.heroRef) {
      this.heroObserver = new IntersectionObserver(
        ([entry]) => {
          this.cdr.markForCheck();
        },
        { threshold: 0.1 },
      );
      this.heroObserver.observe(this.heroRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.heroObserver?.disconnect();
  }

  openModal(shop: Shop): void {
    this.selectedShop = shop;
    this.isModalOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedShop = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  onProceedToOrder(shop: Shop): void {
    this.closeModal();
    this.router.navigate(['/customer/upload'], {
      queryParams: { shopId: shop.id },
    });
  }

  trackByShop(_: number, shop: Shop): number {
    return shop.id;
  }
}
