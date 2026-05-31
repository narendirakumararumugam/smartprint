import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { Title } from '@angular/platform-browser';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { environment } from '../../../environment/environment';

interface UserRow {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'owner' | 'admin';
  city: string;
  active: boolean;
  verified: boolean;
  joinedAt: string;
  ordersCount: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent, DropdownComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly title = inject(Title);
  private readonly adminApi = inject(AdminApiService);

  users: UserRow[] = [];
  filteredUsers: UserRow[] = [];
  searchQuery = '';
  filterType: 'all' | 'customer' | 'owner' | 'admin' = 'all';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

  readonly filterTypeOptions: DropdownOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Customers', value: 'customer' },
    { label: 'Owners', value: 'owner' },
    { label: 'Admins', value: 'admin' },
  ];

  readonly filterStatusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  selectedUser: UserRow | null = null;
  showDetailModal = false;

  ngOnInit(): void {
    this.title.setTitle('User Management - SmartPrint Admin');
    this.loadData();
  }

  private loadData(): void {
    if (environment.useMockData) {
      this.users = this.getMockUsers();
      this.applyFilters();
      return;
    }

    this.adminApi.getUsers().subscribe(data => {
      this.users = data.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        type: u.userType as 'customer' | 'owner' | 'admin',
        city: u.city || '',
        active: u.active,
        verified: u.verified,
        joinedAt: new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        ordersCount: 0,
      }));
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let list = this.users;
    if (this.filterType !== 'all') {
      list = list.filter(u => u.type === this.filterType);
    }
    if (this.filterStatus !== 'all') {
      list = list.filter(u => this.filterStatus === 'active' ? u.active : !u.active);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
      );
    }
    this.filteredUsers = list;
    this.cdr.markForCheck();
  }

  toggleUserStatus(user: UserRow): void {
    const newStatus = !user.active;
    if (!environment.useMockData) {
      this.adminApi.updateUserStatus(user.id, newStatus).subscribe();
    }
    user.active = newStatus;
    this.cdr.markForCheck();
  }

  openDetail(user: UserRow): void {
    this.selectedUser = user;
    this.showDetailModal = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedUser = null;
    this.cdr.markForCheck();
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'admin': return 'badge-purple';
      case 'owner': return 'badge-blue';
      default: return 'badge-gray';
    }
  }

  get totalCustomers(): number { return this.users.filter(u => u.type === 'customer').length; }
  get totalOwners(): number { return this.users.filter(u => u.type === 'owner').length; }
  get totalAdmins(): number { return this.users.filter(u => u.type === 'admin').length; }

  private getMockUsers(): UserRow[] {
    return [
      { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', type: 'customer', city: 'Delhi', active: true, verified: true, joinedAt: 'Jan 15, 2026', ordersCount: 24 },
      { id: '2', name: 'Priya Kapoor', email: 'priya.k@outlook.com', type: 'customer', city: 'Mumbai', active: true, verified: true, joinedAt: 'Feb 3, 2026', ordersCount: 12 },
      { id: '3', name: 'Suresh Kumar', email: 'suresh@quickprint.in', type: 'owner', city: 'Bangalore', active: true, verified: true, joinedAt: 'Dec 1, 2025', ordersCount: 0 },
      { id: '4', name: 'Anjali Mehta', email: 'anjali.m@gmail.com', type: 'owner', city: 'Pune', active: true, verified: false, joinedAt: 'Mar 20, 2026', ordersCount: 0 },
      { id: '5', name: 'Vikram Singh', email: 'vikram@printzone.co', type: 'owner', city: 'Delhi', active: false, verified: false, joinedAt: 'Apr 5, 2026', ordersCount: 0 },
      { id: '6', name: 'Admin User', email: 'admin@smartprint.in', type: 'admin', city: 'Delhi', active: true, verified: true, joinedAt: 'Nov 1, 2025', ordersCount: 0 },
      { id: '7', name: 'Neha Gupta', email: 'neha.g@hotmail.com', type: 'customer', city: 'Chennai', active: true, verified: true, joinedAt: 'Apr 12, 2026', ordersCount: 8 },
      { id: '8', name: 'Arjun Reddy', email: 'arjun.r@gmail.com', type: 'customer', city: 'Hyderabad', active: false, verified: true, joinedAt: 'Feb 28, 2026', ordersCount: 3 },
    ];
  }
}
