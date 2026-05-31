import { Component, OnInit, AfterViewInit, OnDestroy, inject, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { OwnerTopbarService } from '../../../core/services/owner-topbar.service';
import { environment } from '../../../environment/environment';

export interface Order {
  id: string;
  name: string;
  avatar: string;
  bg: string;
  pages: number;
  color: string;
  binding: string;
  copies: number;
  price: number;
  status: 'new' | 'printing' | 'ready';
  time: string;
  files: { name: string; size: string; type: string; }[];
}

export interface Printer {
  name: string;
  model: string;
  status: 'printing' | 'idle' | 'low-ink';
  statusLabel: string;
  job: string;
  progress: number;
}

export interface Activity {
  text: string;
  color: string;
  time: string;
}

export interface Notification {
  text: string;
  time: string;
  unread: boolean;
}

export interface ChartDay {
  day: string;
  cur: number;
  prev: number;
}

export interface StatTile {
  icon: string;
  iconBg: string;
  iconColor: string;
  tagText: string;
  tagBg: string;
  tagColor: string;
  value: string;
  label: string;
  trendIcon: string;
  trendText: string;
  trendUp: boolean;
}

export interface QuickAction {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  action: string;
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly topbar = inject(OwnerTopbarService); // Assumed infrastructure service context

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  shopOpen = true;
  autoApproval = true;
  notifPanelOpen = false;
  drawerOpen = false;
  drawerOrder: Order | null = null;
  currentDate = '';

  todayStats = { orders: 0, revenue: '₹0', pages: '0' };

  statTiles: StatTile[] = [];
  orders: Order[] = [];
  printers: Printer[] = [];
  notifications: Notification[] = [];
  activities: Activity[] = [];
  chartData: ChartDay[] = [];
  quickActions: QuickAction[] = [];
  donutData: { label: string; color: string; pct: number }[] = [];

  get pendingCount(): number {
    return this.orders.filter(o => o.status === 'new').length;
  }

  get maxChartVal(): number {
    return Math.max(...this.chartData.map(d => Math.max(d.cur, d.prev)), 1);
  }

  get unreadNotifCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  ngAfterViewInit(): void {
    if (this.topbarActions) {
      this.topbar.setActions(this.topbarActions);
    }
    this.topbar.setShopOpen(this.shopOpen);
    this.topbar.setShopClosesAt('8:00 PM');
    this.topbar.setPendingOrders(this.pendingCount);
  }

  ngOnDestroy(): void {
    this.topbar.clearActions();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    }

    if (environment.useMockData) {
      this.todayStats = { orders: 0, revenue: '₹0', pages: '0' };
      this.statTiles = [
        { icon: 'bx bx-rupee', iconBg: '#d1fae5', iconColor: '#059669', tagText: 'New', tagBg: '#d1fae5', tagColor: '#059669', value: '₹0', label: 'Monthly Revenue', trendIcon: 'bx bx-time', trendText: 'Awaiting first sale', trendUp: true },
        { icon: 'bx bx-inbox', iconBg: '#dbeafe', iconColor: '#2563eb', tagText: 'New', tagBg: '#dbeafe', tagColor: '#2563eb', value: '0', label: 'Orders This Month', trendIcon: 'bx bx-time', trendText: 'No orders yet', trendUp: true },
        { icon: 'bx bxs-star', iconBg: '#fef9c3', iconColor: '#ca8a04', tagText: 'New', tagBg: '#fef9c3', tagColor: '#ca8a04', value: '-', label: 'Avg. Customer Rating', trendIcon: 'bx bx-time', trendText: 'No reviews yet', trendUp: true },
        { icon: 'bx bx-group', iconBg: '#f3e8ff', iconColor: '#7c3aed', tagText: 'New', tagBg: '#ede9fe', tagColor: '#7c3aed', value: '0', label: 'Unique Customers', trendIcon: 'bx bx-time', trendText: 'No customers yet', trendUp: true }
      ];
      this.orders = [];
      this.printers = [];
      this.notifications = [];
      this.activities = [];
      this.chartData = [
        { day: 'Mon', cur: 0, prev: 0 }, { day: 'Tue', cur: 0, prev: 0 },
        { day: 'Wed', cur: 0, prev: 0 }, { day: 'Thu', cur: 0, prev: 0 },
        { day: 'Fri', cur: 0, prev: 0 }, { day: 'Sat', cur: 0, prev: 0 },
        { day: 'Sun', cur: 0, prev: 0 }
      ];
      this.quickActions = [
        { icon: 'bx bx-inbox', iconBg: '#d1fae5', iconColor: '#059669', label: 'View Orders', action: 'orders' },
        { icon: 'bx bx-purchase-tag', iconBg: '#dbeafe', iconColor: '#2563eb', label: 'Edit Pricing', action: 'pricing' },
        { icon: 'bx bx-sun', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Holiday Mode', action: 'holiday' },
        { icon: 'bx bx-export', iconBg: '#f3e8ff', iconColor: '#7c3aed', label: 'Export Report', action: 'export' },
        { icon: 'bx bx-printer', iconBg: '#ccfbf1', iconColor: '#0f766e', label: 'Test Print', action: 'test-print' },
        { icon: 'bx bx-group', iconBg: '#fce7f3', iconColor: '#be185d', label: 'Customers', action: 'customers' },
        { icon: 'bx bx-store', iconBg: '#f1f5f9', iconColor: '#334155', label: 'Shop Settings', action: 'settings' },
        { icon: 'bx bx-bell', iconBg: '#fef9c3', iconColor: '#92400e', label: 'Notifications', action: 'notif' }
      ];
      this.donutData = [
        { label: 'B&W Print', color: '#0d9488', pct: 0 },
        { label: 'Color Print', color: '#059669', pct: 0 },
        { label: 'Binding', color: '#d97706', pct: 0 }
      ];
    }
  }

  getChartBarHeight(val: number): number {
    return Math.max(6, Math.round((val / this.maxChartVal) * 112));
  }

  formatChartVal(val: number): string {
    return val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val.toString();
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { new: 'Awaiting Approval', printing: 'Printing...', ready: 'Ready for Pickup' };
    return map[status] || status;
  }

  getPrinterIcon(status: string): string {
    const map: Record<string, string> = { printing: 'bx bx-printer', idle: 'bx bxs-check-circle', 'low-ink': 'bx bx-error' };
    return map[status] || 'bx bx-printer';
  }

  getPrinterBg(status: string): string {
    const map: Record<string, string> = { printing: '#dbeafe', idle: '#d1fae5', 'low-ink': '#fef3c7' };
    return map[status] || '#f1f5f9';
  }

  getPrinterColor(status: string): string {
    const map: Record<string, string> = { printing: '#2563eb', idle: '#059669', 'low-ink': '#d97706' };
    return map[status] || '#334155';
  }

  approveOrder(orderId: string, event: Event): void {
    event.stopPropagation();
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'printing';
      order.time = 'Just now';
      this.cdr.markForCheck();
    }
  }

  rejectOrder(orderId: string, event: Event): void {
    event.stopPropagation();
    this.orders = this.orders.filter(o => o.id !== orderId);
    this.cdr.markForCheck();
  }

  openDrawer(order: Order, event?: Event): void {
    if (event) event.stopPropagation();
    this.drawerOrder = order;
    this.drawerOpen = true;
    this.cdr.markForCheck();
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.drawerOrder = null;
    this.cdr.markForCheck();
  }

  toggleShopStatus(): void {
    this.shopOpen = !this.shopOpen;
    this.topbar.setShopOpen(this.shopOpen);
    this.cdr.markForCheck();
  }

  toggleNotifPanel(): void {
    this.notifPanelOpen = !this.notifPanelOpen;
    this.cdr.markForCheck();
  }

  markNotifRead(notif: Notification): void {
    notif.unread = false;
    this.cdr.markForCheck();
  }

  clearNotifs(): void {
    this.notifications.forEach(n => (n.unread = false));
    this.notifPanelOpen = false;
    this.cdr.markForCheck();
  }
}