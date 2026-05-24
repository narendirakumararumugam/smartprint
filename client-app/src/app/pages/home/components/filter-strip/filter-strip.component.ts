import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterType, Shop, SortType } from '../../../../models/shop.model';
import { ToastService } from '../../../../core/services/toast.service';
import { ShopService } from '../../../../core/services/shop.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Filterchip{
  id: FilterType;
  label: string;
  icon: string;
  iconStyle?: string;
}

@Component({
  selector: 'app-filter-strip',
  standalone: true,
  imports: [CommonModule,AsyncPipe,FormsModule],
  templateUrl: './filter-strip.component.html',
  styleUrl: './filter-strip.component.css'
})
export class FilterStripComponent {
  activeFilter: FilterType = 'all';

  readonly chips: Filterchip[] = [
    { id: 'all',    label: 'All Shops',    icon: 'bx bx-grid' },
    { id: 'open',   label: 'Open Now',     icon: 'bx bx-clock', iconStyle: 'color:var(--success)' },
    { id: 'top',    label: 'Rating 4+',    icon: 'bx bx-star', iconStyle: 'color:var(--accent)' },
    { id: 'nearby', label: 'Within 1 km',  icon: 'bx bx-location-pin', iconStyle: 'color:var(--danger)' },
    { id: 'color',  label: 'Color Print',  icon: 'bx bx-palette' },
    { id: 'bind',   label: 'Binding',      icon: 'bx bx-book-open' },
    { id: 'large',  label: 'Large Format', icon: 'bx bx-maximize' },
  ];

  readonly sortOptions: { value: SortType; label: string }[] = [
    { value: 'recommended', label: 'Sort: Recommended' },
    { value: 'rating',      label: 'Sort: Highest Rated' },
    { value: 'distance',    label: 'Sort: Nearest First' },
    { value: 'price',       label: 'Sort: Lowest Price' },
    { value: 'wait',        label: 'Sort: Least Wait' },
  ];

  selectedSort: SortType = 'recommended';

  constructor(public _shopService: ShopService){}

  selectFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this._shopService.setFilter(filter);
  }

  onSortChange(): void {
    this._shopService.setSort(this.selectedSort);
  }
}
