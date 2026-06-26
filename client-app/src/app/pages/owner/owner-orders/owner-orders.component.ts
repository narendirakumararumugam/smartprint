import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropdownComponent,
  DropdownOption,
} from '../../../shared/components/dropdown/dropdown.component';
import { OwnerTopbarService } from '../../../core/services/owner-topbar.service';
import { environment } from '../../../environment/environment';
import {
  OrderResponse,
  OwnerOrdersService,
} from '../../../core/services/owner-orders.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

interface OrderItem {
  id: string;
  orderId?: string;
  customer: string;
  phone?: string;
  avatar: string;
  bg: string;
  pages: number;
  printType: string;
  binding: string;
  copies: number;
  total: number;
  status: string;
  time: string;
  date: string;
  files: { name: string; size: string }[];
  selected?: boolean;
}

interface OrderTab {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-owner-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './owner-orders.component.html',
  styleUrl: './owner-orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly topbar = inject(OwnerTopbarService); // Inferred from topbar actions service context

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  autoApproval = false;
  activeTab = 'all';
  searchQuery = '';
  filterType = '';
  filterDate = '';
  sortBy = 'newest';

  readonly filterTypeOptions: DropdownOption[] = [
    { label: 'All Types', value: '' },
    { label: 'B&W', value: 'B&W' },
    { label: 'Color', value: 'Color' },
  ];

  readonly sortOptions: DropdownOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Amount', value: 'highest' },
    { label: 'Lowest Amount', value: 'lowest' },
  ];

  currentPage = 1;
  pageSize = 10;
  showDrawer = false;
  drawerOrder: OrderItem | null = null;
  showPrinterModal = false;
  selectedPrinter = '';
  selectAll = false;

  orders: OrderItem[] = [];
  printers = ['HP LaserJet M401n', 'Canon iR2625', 'Epson L3252'];

  constructor(
    private readonly ownerOrdersService: OwnerOrdersService,
    private readonly authState: AuthStateService,
  ) {}

  get tabs(): OrderTab[] {
    return [
      { id: 'all', label: 'All', count: this.orders.length },
      {
        id: 'pending',
        label: 'Pending',
        count: this.orders.filter((o) => o.status === 'pending').length,
      },
      {
        id: 'printing',
        label: 'Printing',
        count: this.orders.filter((o) => o.status === 'printing').length,
      },
      {
        id: 'ready',
        label: 'Ready',
        count: this.orders.filter((o) => o.status === 'ready').length,
      },
      {
        id: 'completed',
        label: 'Completed',
        count: this.orders.filter((o) => o.status === 'completed').length,
      },
      {
        id: 'cancelled',
        label: 'Cancelled',
        count: this.orders.filter((o) => o.status === 'cancelled').length,
      },
    ];
  }

  get filteredOrders(): OrderItem[] {
    let result = [...this.orders];

    if (this.activeTab !== 'all') {
      result = result.filter((o) => o.status === this.activeTab);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q),
      );
    }

    if (this.filterType) {
      result = result.filter((o) => o.printType === this.filterType);
    }

    if (this.sortBy === 'newest') {
      // Already sorted by default
    } else if (this.sortBy === 'oldest') {
      result.reverse();
    } else if (this.sortBy === 'highest') {
      result.sort((a, b) => b.total - a.total);
    } else if (this.sortBy === 'lowest') {
      result.sort((a, b) => a.total - b.total);
    }

    return result;
  }

  get paginatedOrders(): OrderItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  get selectedOrders(): OrderItem[] {
    return this.orders.filter((o) => o.selected);
  }

  get pendingRevenue(): number {
    return this.orders
      .filter((o) => o.status === 'pending')
      .reduce((sum, o) => sum + o.total, 0);
  }

  get todayRevenue(): number {
    return this.orders
      .filter((o) => o.status === 'completed' && o.date === '2026-01-15')
      .reduce((sum, o) => sum + o.total, 0);
  }

  statTiles = [
    { label: 'Pending', icon: 'bx bx-time', color: '#d97706', bg: '#fef3c7' },
    {
      label: 'Printing',
      icon: 'bx bx-printer',
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      label: 'Ready',
      icon: 'bx bxs-check-circle',
      color: '#059669',
      bg: '#d1fae5',
    },
    {
      label: 'Completed',
      icon: 'bx bx-check-double',
      color: '#0d9488',
      bg: '#ccfbf1',
    },
    { label: 'Revenue', icon: 'bx bx-rupee', color: '#7c3aed', bg: '#f3e8ff' },
  ];

  ngOnInit(): void {
    // Get shopId from auth state (stored in localstorage during login)
    const shopId = this.authState.currentUser?.shopId;

    if (!shopId) {
      console.error('No shopId found in auth state. Owner must be logged in.');
      this.topbar.setPendingOrders(0);
      return;
    }

    // Fetch orders for this shop from backend
    this.ownerOrdersService.getShopOrders(shopId).subscribe({
      next: (response: OrderResponse[]) => {
        // Map backend OrderResponse to component's OrderItem format
        this.orders = response.map((order) => {
          const customerName = order.customer?.name || 'Unknown';
          const intials = customerName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
          return {
            orderId: order.id,
            id: order.orderNumber,
            customer: customerName, // Backend doesn't return customer name in owner view
            avatar: intials,
            phone: order.customer?.phone,
            bg: this.getRandomColor(),
            pages: order.items.reduce(
              (sum, item) => sum + item.pages * item.copies,
              0,
            ),
            printType: order.items[0]?.colorMode === 'BW' ? 'B&W' : 'Color',
            binding: 'None', // Not in backend response
            copies: order.items[0]?.copies ?? 1,
            total: order.total,
            status: order.status,
            time: this.getRelativeTime(order.createdAt),
            date: order.createdAt.split('T')[0],
            files: order.items.map((item) => ({
              name: item.fileName,
              size: '0 MB',
            })),
          };
        });

        this.topbar.setPendingOrders(this.tabs[1]?.count ?? 0);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
        this.topbar.setPendingOrders(0);
        this.cdr.markForCheck();
      },
    });
  }

  private getRelativeTime(isoDate: string): string {
    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  private getRandomColor(): string {
    const colors = [
      '#0d9488',
      '#7c3aed',
      '#f97316',
      '#2563eb',
      '#059669',
      '#d97706',
      '#e11d48',
      '#8b5cf6',
      '#14b8a6',
      '#facc15',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  ngAfterViewInit(): void {
    if (this.topbarActions) {
      this.topbar.setActions(this.topbarActions);
    }
  }

  ngOnDestroy(): void {
    this.topbar.clearActions();
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  getStatValue(Label: string): string {
    switch (Label) {
      case 'Pending':
        return this.orders
          .filter((o) => o.status === 'pending')
          .length.toString();
      case 'Printing':
        return this.orders
          .filter((o) => o.status === 'printing')
          .length.toString();
      case 'Ready':
        return this.orders
          .filter((o) => o.status === 'ready')
          .length.toString();
      case 'Completed':
        return this.orders
          .filter((o) => o.status === 'completed')
          .length.toString();
      case 'Revenue':
        return '₹' + this.todayRevenue.toLocaleString();
      default:
        return '0';
    }
  }

  toggleAutoApproval(): void {
    this.autoApproval = !this.autoApproval;
    this.cdr.markForCheck();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.paginatedOrders.forEach((o) => (o.selected = this.selectAll));
    this.cdr.markForCheck();
  }

  toggleSelect(order: OrderItem): void {
    order.selected = !order.selected;
    this.selectAll = this.paginatedOrders.every((o) => o.selected);
    this.cdr.markForCheck();
  }

  approveOrder(order: OrderItem): void {
    if (!order.orderId) return;
    this.ownerOrdersService.updateOrderStatus(order.orderId, 'printing').subscribe({
      next: () => {
        order.status = 'printing';
        order.selected = false;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to approve order:', err),
    });
  }

  rejectOrder(order: OrderItem): void {
    if (!order.orderId) return;
    this.ownerOrdersService.updateOrderStatus(order.orderId, 'cancelled').subscribe({
      next: () => {
        order.status = 'cancelled';
        order.selected = false;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to reject order:', err),
    });
  }

  markReady(order: OrderItem): void {
    if (!order.orderId) return;
    this.ownerOrdersService.updateOrderStatus(order.orderId, 'ready').subscribe({
      next: () => {
        order.status = 'ready';
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to mark ready:', err),
    });
  }

  markCompleted(order: OrderItem): void {
    if (!order.orderId) return;
    this.ownerOrdersService.updateOrderStatus(order.orderId, 'completed').subscribe({
      next: () => {
        order.status = 'completed';
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to mark completed:', err),
    });
  }

  bulkApprove(): void {
    const pendingOrders = this.selectedOrders.filter(
      (o) => o.status === 'pending' && o.orderId,
    );
    pendingOrders.forEach((order) => {
      this.ownerOrdersService.updateOrderStatus(order.orderId!, 'printing').subscribe({
        next: () => {
          order.status = 'printing';
          order.selected = false;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Failed to approve order:', err),
      });
    });
    this.selectAll = false;
  }

  bulkReject(): void {
    const pendingOrders = this.selectedOrders.filter(
      (o) => o.status === 'pending' && o.orderId,
    );
    pendingOrders.forEach((order) => {
      this.ownerOrdersService
        .updateOrderStatus(order.orderId!, 'cancelled')
        .subscribe({
          next: () => {
            order.status = 'cancelled';
            order.selected = false;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Failed to reject order:', err),
        });
    });
    this.selectAll = false;
  }

  openDrawer(order: OrderItem): void {
    this.drawerOrder = order;
    this.showDrawer = true;
    this.cdr.markForCheck();
  }

  closeDrawer(): void {
    this.showDrawer = false;
    this.drawerOrder = null;
    this.cdr.markForCheck();
  }

  openPrinterModal(): void {
    this.showPrinterModal = true;
    this.selectedPrinter = this.printers[0];
    this.cdr.markForCheck();
  }

  closePrinterModal(): void {
    this.showPrinterModal = false;
    this.cdr.markForCheck();
  }

  assignPrinter(): void {
    this.closePrinterModal();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.markForCheck();
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status-pending',
      printing: 'status-printing',
      ready: 'status-ready',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pending',
      printing: 'Printing',
      ready: 'Ready',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status] || status;
  }
}
