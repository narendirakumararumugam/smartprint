import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { DropdownComponent, DropdownOption } from '../../shared/components/dropdown/dropdown.component';
import { Collection, SavedFilterType, SavedShop, SavedSortType, SavedViewType } from '../../models/saved-shop.model';
import { MESSAGES } from '../../core/constants/messages';
import { SavedShopService } from '../../core/services/saved-shop.service';
import { ToastService } from '../../core/services/toast.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastContainerComponent, DropdownComponent],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedComponent implements OnInit {
  private readonly savedShopService = inject(SavedShopService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);

  savedShops: SavedShop[] = [];
  filteredShops: SavedShop[] = [];
  collections: Collection[] = [];

  currentView: SavedViewType = 'grid';
  currentFilter: SavedFilterType = 'all';
  currentCollection = 'all';
  currentSort: SavedSortType = 'saved';
  
  readonly sortOptions: DropdownOption[] = [
    { label: 'Recently Saved', value: 'saved' },
    { label: 'Highest Rating', value: 'rating' },
    { label: 'Nearest First', value: 'distance' },
    { label: 'Name A-Z', value: 'name' },
  ];
  searchQuery = '';

  selectedShop: SavedShop | null = null;
  isModalOpen = false;

  readonly filters: { key: SavedFilterType; label: string; icon: string; iconColor?: string }[] = [
    { key: 'all', label: 'All', icon: 'bx bx-border-all' },
    { key: 'open', label: 'Open Now', icon: 'bx bxs-circle', iconColor: 'var(--success)' },
    { key: 'nearby', label: 'Nearby', icon: 'bx bx-current-location' },
    { key: 'top', label: 'Top Rated', icon: 'bx bxs-star' },
  ];

  ngOnInit(): void {
    this.title.setTitle('Saved Shops - SmartPrint');
    this.savedShopService.loadSavedShops().subscribe(shops => {
      this.savedShops = shops;
      this.applyFilters();
      this.cdr.markForCheck();
    });
    this.savedShopService.getCollections().subscribe(cols => {
      this.collections = cols;
      this.cdr.markForCheck();
    });
  }

  /* -- Stats -- */
  get openCount(): number {
    return this.savedShops.filter(s => s.isOpen).length;
  }

  get avgRating(): string {
    if (!this.savedShops.length) return '0';
    return (this.savedShops.reduce((sum, s) => sum + s.rating, 0) / this.savedShops.length).toFixed(1);
  }

  getCollectionCount(colId: string): number {
    if (colId === 'all') return this.savedShops.length;
    return this.savedShops.filter(s => s.collections.includes(colId)).length;
  }

  /* -- Filtering & Sorting -- */
  setFilter(filter: SavedFilterType): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  setCollection(colId: string): void {
    this.currentCollection = colId;
    this.applyFilters();
  }

  setSort(sort: SavedSortType): void {
    this.currentSort = sort;
    this.applyFilters();
  }

  onSearch(query: string): void {
    this.searchQuery = query.trim().toLowerCase();
    this.applyFilters();
  }

  setView(view: SavedViewType): void {
    this.currentView = view;
    this.cdr.markForCheck();
  }

  private applyFilters(): void {
    let list = [...this.savedShops];

    // Collection filter
    if (this.currentCollection !== 'all') {
      list = list.filter(s => s.collections.includes(this.currentCollection));
    }

    // Status filters
    if (this.currentFilter === 'open') list = list.filter(s => s.isOpen);
    if (this.currentFilter === 'nearby') list = list.filter(s => s.distance <= 0.7);
    if (this.currentFilter === 'top') list = list.filter(s => s.rating >= 4.6);

    // Search
    if (this.searchQuery) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(this.searchQuery) ||
        s.address.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort
    switch (this.currentSort) {
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'distance': list.sort((a, b) => a.distance - b.distance); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      // 'saved' keeps original order (most recently saved first)
    }

    this.filteredShops = list;
    this.cdr.markForCheck();
  }

  /* -- Actions -- */
  unsaveShop(shop: SavedShop, event?: MouseEvent): void {
    event?.stopPropagation();
    this.savedShopService.unsaveShop(shop.id).subscribe(() => {
      this.savedShops = this.savedShops.filter(s => s.id !== shop.id);
      this.applyFilters();
      this.toastService.show(MESSAGES.SHOPS.REMOVED(shop.name), 'info');
      this.cdr.markForCheck();
    });
  }

  openModal(shop: SavedShop): void {
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

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement) === event.currentTarget) {
      this.closeModal();
    }
  }

  shareShop(shop: SavedShop): void {
    if (isPlatformBrowser(this.platformId) && navigator.share) {
      navigator.share({ title: `${shop.name} on SmartPrint`, url: window.location.href }).catch(() => {});
    } else {
      this.toastService.show(MESSAGES.SHOPS.SHARE_COPIED(shop.name), 'success');
    }
  }

  relativeDate(dateStr: string): string {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    if (diff < 7) return `${diff} days ago`;
    const weeks = Math.floor(diff / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  getTodayKey(): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  }

  trackById(_: number, item: SavedShop): number { return item.id; }
  trackByColId(_: number, item: Collection): string { return item.id; }
}
