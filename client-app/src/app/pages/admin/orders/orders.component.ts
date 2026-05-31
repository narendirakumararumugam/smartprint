import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  shopName: string;
  status: 'processing' | 'active' | 'ready' | 'completed' | 'cancelled';
  total: string;
  items: number;
  createdAt: string;
}

type OrderFilter = 'all' | 'processing' | 'active' | 'ready' | 'completed' | 'cancelled';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly title = inject(Title);
  private readonly adminApi = inject(AdminApiService);

  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  searchQuery = '';
  filterStatus: OrderFilter = 'all';

  statusTabs: { key: OrderFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'processing', label: 'Processing' },
    { key: 'active', label: 'Active' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' }
    // Note: 'cancelled' tab is cut off at the bottom of the image but exists in the OrderFilter type.
  ];
// ... (properties from previous files)

  ngOnInit(): void {
    this.title.setTitle('Admin - Orders');
    this.loadOrders();
  }

  /**
   * Fetches the orders list from the admin API service
   */
  loadOrders(): void {
    this.adminApi.getOrders().subscribe({
      next: (data: any) => {
        // Map any slight differences between API definitions and UI requirements if necessary
        this.orders = data;
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load admin orders:', err);
      }
    });
  }

  /**
   * Updates the current status filter tab and reapplies active filters
   */
  setFilter(status: OrderFilter): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  /**
   * Computes the total item count dynamically for each status badge tab
   */
  getCount(status: OrderFilter): number {
    if (status === 'all') {
      return this.orders.length;
    }
    return this.orders.filter(order => order.status === status).length;
  }

  /**
   * Handles local combined searching and status tab filtering
   */
  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredOrders = this.orders.filter(order => {
      // 1. Filter by status tab selection
      const matchesStatus = this.filterStatus === 'all' || order.status === this.filterStatus;

      // 2. Filter by search query input criteria
      const matchesSearch = !query || 
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.shopName.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }

  /**
   * Resolves the string name representing CSS color modifiers for individual status pills
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status-green';
      case 'active':
        return 'status-blue';
      case 'ready':
        return 'status-teal';
      case 'processing':
        return 'status-amber';
      case 'cancelled':
        return 'status-red';
      default:
        return '';
    }
  }

  /**
   * Formats raw code values into readable display labels for client presentation
   */
  getStatusLabel(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}