import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, TemplateRef, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { DropdownComponent, DropdownOption } from '../../../../shared/components/dropdown/dropdown.component';
import { OwnerTopbarService } from '../../../../core/services/owner-topbar.service';
import { environment } from '../../../../environment/environment';

interface Customer {
  name: string;
  avatar: string;
  bg: string;
  email: string;
  orders: number;
  spent: number;
  lastVisit: string;
  status: 'active' | 'inactive' | 'new';
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, ChartCardComponent, DropdownComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly topbar = inject(OwnerTopbarService);

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  searchQuery = '';
  filterStatus = '';
  sortBy = 'spent';

  readonly filterStatusOptions: DropdownOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'New', value: 'new' },
    { label: 'Inactive', value: 'inactive' },
  ];

  readonly sortOptions: DropdownOption[] = [
    { label: 'Highest Spent', value: 'spent' },
    { label: 'Most Orders', value: 'orders' },
    { label: 'Name A-Z', value: 'name' },
  ];

  stats: { icon: string; iconBg: string; iconColor: string; label: string; value: string; trend: string; trendUp: boolean; }[] = [];
  customers: Customer[] = [];
  topCustomersData: { name: string; orders: number; percent: number; }[] = [];
  retentionData: { month: string; rate: number; }[] = [];

  ngOnInit(): void {
    if (environment.useMockData) {
      this.stats = [
        { icon: 'bx bx-group', iconBg: '#ccfbf1', iconColor: '#0d9488', label: 'Total Customers', value: '248', trend: '+32 this month', trendUp: true },
        { icon: 'bx bx-user-plus', iconBg: '#dbeafe', iconColor: '#2563eb', label: 'New This Week', value: '18', trend: '+6 vs last week', trendUp: true },
        { icon: 'bx bx-refresh', iconBg: '#f3e8ff', iconColor: '#7c3aed', label: 'Repeat Rate', value: '62%', trend: '+4.5%', trendUp: true },
        { icon: 'bx bx-rupee', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Avg. Lifetime Value', value: '₹1,240', trend: '+₹180', trendUp: true }
      ];

      this.customers = [
        { name: 'Arjun Mehta', avatar: 'AM', bg: '#0d9488', email: 'arjun.m@email.com', orders: 24, spent: 4250, lastVisit: 'Today', status: 'active' },
        { name: 'Priya Sharma', avatar: 'PS', bg: '#7c3aed', email: 'priya.s@email.com', orders: 18, spent: 3120, lastVisit: 'Yesterday', status: 'active' },
        { name: 'Sneha Kapoor', avatar: 'SK', bg: '#d97706', email: 'sneha.k@email.com', orders: 31, spent: 5840, lastVisit: '2 days ago', status: 'active' },
        { name: 'Rahul Verma', avatar: 'RV', bg: '#2563eb', email: 'rahul.v@email.com', orders: 8, spent: 620, lastVisit: '1 week ago', status: 'inactive' },
        { name: 'Divya Reddy', avatar: 'DR', bg: '#059669', email: 'divya.r@email.com', orders: 12, spent: 2100, lastVisit: '3 days ago', status: 'active' },
        { name: 'Karthik Nair', avatar: 'KN', bg: '#dc2626', email: 'karthik.n@email.com', orders: 3, spent: 380, lastVisit: 'Today', status: 'new' },
        { name: 'Meera Joshi', avatar: 'MJ', bg: '#be185d', email: 'meera.j@email.com', orders: 15, spent: 2680, lastVisit: '4 days ago', status: 'active' },
        { name: 'Vikram Patel', avatar: 'VP', bg: '#0d9488', email: 'vikram.p@email.com', orders: 6, spent: 890, lastVisit: '2 weeks ago', status: 'inactive' },
        { name: 'Anita Desai', avatar: 'AD', bg: '#7c3aed', email: 'anita.d@email.com', orders: 2, spent: 240, lastVisit: 'Yesterday', status: 'new' },
        { name: 'Raj Kumar', avatar: 'RK', bg: '#2563eb', email: 'raj.k@email.com', orders: 22, spent: 3950, lastVisit: 'Today', status: 'active' }
      ];

      this.topCustomersData = [
        { name: 'Sneha Kapoor', orders: 31, percent: 100 },
        { name: 'Arjun Mehta', orders: 24, percent: 77 },
        { name: 'Raj Kumar', orders: 22, percent: 71 },
        { name: 'Priya Sharma', orders: 18, percent: 58 },
        { name: 'Meera Joshi', orders: 15, percent: 48 }
      ];

      this.retentionData = [
        { month: 'Oct', rate: 58 },
        { month: 'Nov', rate: 61 },
        { month: 'Dec', rate: 55 },
        { month: 'Jan', rate: 62 }
      ];
    }
  }

  ngAfterViewInit(): void {
    if (this.topbarActions) {
      this.topbar.setActions(this.topbarActions);
    }
  }

  ngOnDestroy(): void {
    this.topbar.clearActions();
  }

  get filteredCustomers(): Customer[] {
    let result = [...this.customers];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }

    if (this.filterStatus) {
      result = result.filter(c => c.status === this.filterStatus);
    }

    if (this.sortBy === 'spent') {
      result.sort((a, b) => b.spent - a.spent);
    } else if (this.sortBy === 'orders') {
      result.sort((a, b) => b.orders - a.orders);
    } else if (this.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }

  getStatusClass(status: string): string {
    return 'status-' + status;
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}