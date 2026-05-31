import { Component, OnInit, AfterViewInit, OnDestroy, inject, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { OwnerTopbarService } from '../../../core/services/owner-topbar.service';
import { environment } from '../../../environment/environment';

interface OrderItem {
  id: string;
  customer: string;
  avatar: string;
  bg: string;
  pages: number;
  printType: string;
  binding: string;
  copies: number;
  total: number;
  status: 'pending' | 'printing' | 'ready' | 'completed' | 'cancelled';
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

  get tabs(): OrderTab[] {
    return [
      { id: 'all', label: 'All', count: this.orders.length },
      { id: 'pending', label: 'Pending', count: this.orders.filter(o => o.status === 'pending').length },
      { id: 'printing', label: 'Printing', count: this.orders.filter(o => o.status === 'printing').length },
      { id: 'ready', label: 'Ready', count: this.orders.filter(o => o.status === 'ready').length },
      { id: 'completed', label: 'Completed', count: this.orders.filter(o => o.status === 'completed').length },
      { id: 'cancelled', label: 'Cancelled', count: this.orders.filter(o => o.status === 'cancelled').length },
    ];
  }

  get filteredOrders(): OrderItem[] {
    let result = [...this.orders];

    if (this.activeTab !== 'all') {
      result = result.filter(o => o.status === this.activeTab);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
      );
    }

    if (this.filterType) {
      result = result.filter(o => o.printType === this.filterType);
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
    return this.orders.filter(o => o.selected);
  }

  get pendingRevenue(): number {
    return this.orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.total, 0);
  }

  get todayRevenue(): number {
    return this.orders.filter(o => o.status === 'completed' && o.date === '2026-01-15').reduce((sum, o) => sum + o.total, 0);
  }

  statTiles = [
    { label: 'Pending', icon: 'bx bx-time', color: '#d97706', bg: '#fef3c7' },
    { label: 'Printing', icon: 'bx bx-printer', color: '#2563eb', bg: '#dbeafe' },
    { label: 'Ready', icon: 'bx bxs-check-circle', color: '#059669', bg: '#d1fae5' },
    { label: 'Completed', icon: 'bx bx-check-double', color: '#0d9488', bg: '#ccfbf1' },
    { label: 'Revenue', icon: 'bx bx-rupee', color: '#7c3aed', bg: '#f3e8ff' },
  ];

  ngOnInit(): void {
    if (environment.useMockData) {
      this.orders = [
        { id: 'PH-2026-0044', customer: 'Arjun Mehta', avatar: 'AM', bg: '#0d9488', pages: 42, printType: 'B&W', binding: 'Spiral', copies: 1, total: 126, status: 'pending', time: '2 min ago', date: '2026-01-15', files: [{ name: 'Thesis_Final.pdf', size: '4.2 MB' }] },
        { id: 'PH-2026-0043', customer: 'Priya Sharma', avatar: 'PS', bg: '#7c3aed', pages: 18, printType: 'Color', binding: 'None', copies: 2, total: 288, status: 'pending', time: '8 min ago', date: '2026-01-15', files: [{ name: 'Project_Report.pdf', size: '2.1 MB' }] },
        { id: 'PH-2026-0042', customer: 'Rahul Verma', avatar: 'RV', bg: '#2563eb', pages: 6, printType: 'B&W', binding: 'None', copies: 1, total: 12, status: 'printing', time: '15 min ago', date: '2026-01-15', files: [{ name: 'Resume.pdf', size: '0.8 MB' }] },
        { id: 'PH-2026-0041', customer: 'Sneha Kapoor', avatar: 'SK', bg: '#d97706', pages: 120, printType: 'B&W', binding: 'Hard', copies: 1, total: 840, status: 'ready', time: '32 min ago', date: '2026-01-15', files: [{ name: 'Dissertation.pdf', size: '12.4 MB' }] },
        { id: 'PH-2026-0040', customer: 'Vikram Patel', avatar: 'VP', bg: '#059669', pages: 8, printType: 'Color', binding: 'None', copies: 3, total: 192, status: 'completed', time: '1 hr ago', date: '2026-01-15', files: [{ name: 'Brochure.pdf', size: '1.5 MB' }] },
        { id: 'PH-2026-0039', customer: 'Anita Desai', avatar: 'AD', bg: '#be185d', pages: 24, printType: 'B&W', binding: 'Spiral', copies: 1, total: 78, status: 'completed', time: '2 hrs ago', date: '2026-01-14', files: [{ name: 'Notes.pdf', size: '3.2 MB' }] },
        { id: 'PH-2026-0038', customer: 'Raj Kumar', avatar: 'RK', bg: '#dc2626', pages: 4, printType: 'Color', binding: 'None', copies: 1, total: 32, status: 'cancelled', time: '3 hrs ago', date: '2026-01-14', files: [{ name: 'Poster.pdf', size: '5.1 MB' }] },
        { id: 'PH-2026-0037', customer: 'Meera Joshi', avatar: 'MJ', bg: '#0d9488', pages: 60, printType: 'B&W', binding: 'Hard', copies: 2, total: 340, status: 'completed', time: '4 hrs ago', date: '2026-01-14', files: [{ name: 'Thesis.pdf', size: '8.3 MB' }] },
        { id: 'PH-2026-0036', customer: 'Karthik Nair', avatar: 'KN', bg: '#7c3aed', pages: 12, printType: 'B&W', binding: 'None', copies: 1, total: 24, status: 'completed', time: '5 hrs ago', date: '2026-01-13', files: [{ name: 'Assignment.pdf', size: '1.1 MB' }] },
        { id: 'PH-2026-0035', customer: 'Divya Reddy', avatar: 'DR', bg: '#2563eb', pages: 30, printType: 'Color', binding: 'Spiral', copies: 1, total: 270, status: 'completed', time: '6 hrs ago', date: '2026-01-13', files: [{ name: 'Presentation.pdf', size: '6.7 MB' }] }
      ];
    }
    this.topbar.setPendingOrders(this.tabs[1]?.count ?? 0);
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
            case 'Pending': return this.orders.filter(o => o.status === 'pending').length.toString();
            case 'Printing': return this.orders.filter(o => o.status === 'printing').length.toString();
            case 'Ready': return this.orders.filter(o => o.status === 'ready').length.toString();
            case 'Completed': return this.orders.filter(o => o.status === 'completed').length.toString();
            case 'Revenue': return '₹' + this.todayRevenue.toLocaleString();
            default: return '0';
        }
    }

    toggleAutoApproval(): void {
        this.autoApproval = !this.autoApproval;
        this.cdr.markForCheck();
    }

    toggleSelectAll(): void {
        this.selectAll = !this.selectAll;
        this.paginatedOrders.forEach(o => (o.selected = this.selectAll));
        this.cdr.markForCheck();
    }

    toggleSelect(order: OrderItem): void {
        order.selected = !order.selected;
        this.selectAll = this.paginatedOrders.every(o => o.selected);
        this.cdr.markForCheck();
    }

    approveOrder(order: OrderItem): void {
        order.status = 'printing';
        order.selected = false;
        this.cdr.markForCheck();
    }

    rejectOrder(order: OrderItem): void {
        order.status = 'cancelled';
        order.selected = false;
        this.cdr.markForCheck();
    }

    markReady(order: OrderItem): void {
        order.status = 'ready';
        this.cdr.markForCheck();
    }

    markCompleted(order: OrderItem): void {
        order.status = 'completed';
        this.cdr.markForCheck();
    }

    bulkApprove(): void {
        this.selectedOrders.forEach(o => {
            if (o.status === 'pending') o.status = 'printing';
            o.selected = false;
        });
        this.selectAll = false;
        this.cdr.markForCheck();
    }

    bulkReject(): void {
        this.selectedOrders.forEach(o => {
            if (o.status === 'pending') o.status = 'cancelled';
            o.selected = false;
        });
        this.selectAll = false;
        this.cdr.markForCheck();
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