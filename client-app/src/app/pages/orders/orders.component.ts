import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MESSAGES } from '../../core/constants/messages';
import { environment } from '../../environment/environment';
import {
  CustomerOrderService,
  OrderResponse,
} from '../../core/services/customer-order.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { OrderHeaderComponent } from './components/order-header/order-header.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';
import {
  DropdownComponent,
  DropdownOption,
} from '../../shared/components/dropdown/dropdown.component';
import { ToastService } from '../../core/services/toast.service';
import { Title } from '@angular/platform-browser';

export interface OrderItem {
  name: string;
  qty: number;
  rate: string;
  total: string;
}

export interface OrderStep {
  label: string;
  time: string;
  desc: string;
  state: 'done' | 'active' | 'pending';
}

export interface Order {
  id: string;
  shopName: string;
  shopIcon: string;
  shopGrad: string;
  status: 'active' | 'ready' | 'processing' | 'completed' | 'cancelled';
  statusLabel: string;
  date: string;
  time: string;
  pickupTime: string;
  items: OrderItem[];
  subtotal: string;
  tax: string;
  total: string;
  totalNum: number;
  note: string;
  files: string[];
  pages: number;
  copies: number;
  address: string;
  phone: string;
  steps: OrderStep[];
  progress: number;
  progressLabel: string;
  canCancel: boolean;
  canReorder: boolean;
}

type TabType = 'all' | 'active' | 'ready' | 'completed' | 'cancelled';
type SortType = 'newest' | 'oldest' | 'amount-high' | 'amount-low';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ToastContainerComponent,
    OrderHeaderComponent,
    OrderCardComponent,
    OrderDetailModalComponent,
    DropdownComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  readonly tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'active', label: 'Active' },
    { key: 'ready', label: 'Ready for Pickup' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  activeTab: TabType = 'all';
  searchQuery = '';
  sortBy: SortType = 'newest';

  readonly sortOptions: DropdownOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Amount: High to Low', value: 'amount-high' },
    { label: 'Amount: Low to High', value: 'amount-low' },
  ];

  selectedOrder: Order | null = null;
  isModalOpen = false;

  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private readonly orderService = inject(CustomerOrderService);

  ngOnInit(): void {
    this.title.setTitle('My Orders - SmartPrint');
    if (environment.useMockData) {
      this.orders = this.getMockOrders();
      this.applyFilters();
      setTimeout(() => {
        this.toastService.show(
          'Order PH-2026-0041 is ready for pickup at Campus Prints!',
          'success',
        );
      }, 800);
    } else {
      this.loadOrders();
    }
  }

  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.map((o) => this.mapOrderResponse(o));
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastService.show(MESSAGES.ORDERS.LOAD_FAILED, 'warning');
        this.cdr.markForCheck();
      },
    });
  }

  private mapOrderResponse(o: OrderResponse): Order {
    const date = new Date(o.createdAt);
    return {
      id: o.orderNumber || o.id,
      shopName: o.shopName || 'Unknown Shop',
      shopIcon: '',
      shopGrad: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
      status: (o.status as any) || 'active',
      statusLabel: o.status
        ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
        : 'Active',
      date: date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      pickupTime: o.pickupTime || '-',
      items: (o.items || []).map((i) => ({
        name: i.fileName,
        qty: i.copies,
        rate: `₹${i.rate}`,
        total: `₹${i.total}`,
      })),
      subtotal: `₹${o.subtotal}`,
      tax: `₹${o.tax}`,
      total: `₹${o.total}`,
      totalNum: o.total,
      note: o.specialNote || '',
      files: (o.items || []).map((i) => i.fileName),
      pages: (o.items || []).reduce((sum, i) => sum + i.pages, 0),
      copies: (o.items || []).reduce((sum, i) => sum + i.copies, 0),
      address: '',
      phone: '',
      steps: (o.timeline || []).map((t) => ({
        label: t.label,
        time: t.eventTime || '',
        desc: t.description,
        state: t.state as any,
      })),
      progress:
        o.status === 'completed'
          ? 100
          : o.status === 'ready'
            ? 75
            : o.status === 'active'
              ? 50
              : 0,
      progressLabel:
        o.status === 'completed'
          ? 'Completed'
          : o.status === 'ready'
            ? 'Ready for pickup'
            : 'In progress',
      canCancel: o.status === 'active' || o.status === 'processing',
      canReorder: o.status === 'completed' || o.status === 'cancelled',
    };
  }

  /* -- Counts -- */
  getCount(tab: TabType): number {
    if (tab === 'all') return this.orders.length;
    return this.orders.filter((o) => o.status === tab).length;
  }

  get totalSpent(): string {
    const sum = this.orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.totalNum, 0);
    return '₹' + sum.toLocaleString('en-IN');
  }

  /* -- Tab / Filter / Sort -- */
  setTab(tab: TabType): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.orders;

    if (this.activeTab !== 'all') {
      list = list.filter((o) => o.status === this.activeTab);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.shopName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q)),
      );
    }

    switch (this.sortBy) {
      case 'oldest':
        list = [...list].reverse();
        break;
      case 'amount-high':
        list = [...list].sort((a, b) => b.totalNum - a.totalNum);
        break;
      case 'amount-low':
        list = [...list].sort((a, b) => a.totalNum - b.totalNum);
        break;
    }

    this.filteredOrders = list;
    this.cdr.markForCheck();
  }

  /* -- Actions -- */
  openModal(order: Order): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  cancelOrder(order: Order): void {
    if (!environment.useMockData) {
      this.orderService.cancelOrder(order.id).subscribe({
        next: () => {
          this.updateOrderStatus(order, 'cancelled', 'Cancelled', 0);
          this.toastService.show(
            MESSAGES.ORDERS.CANCELLED(order.id),
            'warning',
          );
        },
        error: () =>
          this.toastService.show(MESSAGES.ORDERS.CANCEL_FAILED, 'warning'),
      });
      return;
    }
    this.updateOrderStatus(order, 'cancelled', 'Cancelled', 0);
    this.toastService.show(MESSAGES.ORDERS.CANCELLED(order.id), 'warning');
  }

  confirmPickup(order: Order): void {
    if (!environment.useMockData) {
      this.orderService.confirmPickup(order.id).subscribe({
        next: () => {
          this.updateOrderStatus(order, 'completed', 'Completed', 100);
          this.toastService.show(
            MESSAGES.ORDERS.PICKUP_CONFIRMED(order.id),
            'success',
          );
        },
        error: () =>
          this.toastService.show(MESSAGES.ORDERS.PICKUP_FAILED, 'warning'),
      });
      return;
    }
    this.updateOrderStatus(order, 'completed', 'Completed', 100);
    this.toastService.show(
      MESSAGES.ORDERS.PICKUP_CONFIRMED(order.id),
      'success',
    );
  }

  private updateOrderStatus(
    order: Order,
    status: any,
    label: string,
    progress: number,
  ): void {
    order.status = status;
    order.statusLabel = label;
    order.canCancel = false;
    order.canReorder = true;
    order.progress = progress;
    order.progressLabel =
      status === 'cancelled' ? 'Order was cancelled' : 'Picked up today';
    this.applyFilters();
    this.cdr.markForCheck();
  }

  reorder(order: Order): void {
    this.toastService.show(MESSAGES.ORDERS.REORDER(order.shopName), 'info');
  }

  /* -- Helpers -- */
  trackByOrderId(_: number, order: Order): string {
    return order.id;
  }
  trackByIndex(index: number): number {
    return index;
  }

  /* -- Mock Data -- */
  private getMockOrders(): Order[] {
    return [
      {
        id: 'PH-2026-0042',
        shopName: 'PrintPro Express',
        shopIcon: '🖨️',
        shopGrad: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
        status: 'active',
        statusLabel: 'In Progress',
        date: 'Apr 30, 2026',
        time: '10:24 AM',
        pickupTime: '~25 min',
        items: [
          { name: 'Color Print (A4)', qty: 30, rate: '₹10', total: '₹300' },
          { name: 'Spiral Binding', qty: 2, rate: '₹30', total: '₹60' },
          { name: 'Lamination (A4)', qty: 5, rate: '₹15', total: '₹75' },
        ],
        subtotal: '₹435',
        tax: '₹0 (incl.)',
        total: '₹435',
        totalNum: 435,
        note: 'Please use glossy paper for color prints.',
        files: ['Thesis_Chapter1.pdf', 'Thesis_Chapter2.pdf'],
        pages: 30,
        copies: 1,
        address: 'Shop 12, F-Block, Connaught Place, New Delhi',
        phone: '+91 98765 43210',
        steps: [
          {
            label: 'Order Placed',
            time: '10:24 AM',
            desc: 'Order received by shop.',
            state: 'done',
          },
          {
            label: 'Printing',
            time: '10:31 AM',
            desc: 'Your documents are being printed.',
            state: 'active',
          },
          { label: 'Binding', time: '-', desc: '', state: 'pending' },
          { label: 'Ready', time: '-', desc: '', state: 'pending' },
        ],
        progress: 45,
        progressLabel: 'Printing in progress...',
        canCancel: true,
        canReorder: false,
      },
      {
        id: 'PH-2026-0041',
        shopName: 'Campus Prints',
        shopIcon: '🏪',
        shopGrad: 'linear-gradient(135deg,#059669,#34d399)',
        status: 'ready',
        statusLabel: 'Ready for Pickup',
        date: 'Apr 30, 2026',
        time: '9:05 AM',
        pickupTime: 'Today 9:00 AM',
        items: [
          { name: 'B&W Print (A4)', qty: 120, rate: '₹1.5', total: '₹180' },
          { name: 'Hard Binding', qty: 1, rate: '₹220', total: '₹220' },
        ],
        subtotal: '₹400',
        tax: '₹0 (incl.)',
        total: '₹400',
        totalNum: 400,
        note: '',
        files: ['Project_Report_Final.pdf'],
        pages: 120,
        copies: 1,
        address: 'Opposite North Campus Gate, GTB Nagar, New Delhi',
        phone: '+91 76543 21098',
        steps: [
          {
            label: 'Order Placed',
            time: '9:05 AM',
            desc: 'Order received.',
            state: 'done',
          },
          {
            label: 'Printing',
            time: '9:12 AM',
            desc: '120 pages printed.',
            state: 'done',
          },
          {
            label: 'Binding',
            time: '9:28 AM',
            desc: 'Hard-bound cover applied.',
            state: 'done',
          },
          {
            label: 'Ready',
            time: '9:45 AM',
            desc: 'Your order is packed and ready! Please collect.',
            state: 'active',
          },
        ],
        progress: 75,
        progressLabel: 'Ready for pickup',
        canCancel: false,
        canReorder: true,
      },
    ];
  }
}
