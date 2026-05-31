import { Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { environment } from '../../../environment/environment';
import { AdminApiService } from '../../../core/services/admin-api.service';

interface StatCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
}

interface RecentActivity {
  icon: string;
  iconBg: string;
  text: string;
  time: string;
}

interface PendingVerification {
  shopName: string;
  ownerName: string;
  city: string;
  submittedAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly title = inject(Title);
  private readonly adminApi = inject(AdminApiService);

  stats: StatCard[] = [];
  recentActivity: RecentActivity[] = [];
  pendingVerifications: PendingVerification[] = [];
  ordersToday = { completed: 0, active: 0, cancelled: 0, processing: 0 };

  ngOnInit(): void {
    this.title.setTitle('Admin Dashboard - SmartPrint');
    this.loadData();
  }

  private loadData(): void {
    if (environment.useMockData) {
      this.stats = [
        { icon: 'bx bx-group', iconBg: '#ede9fe', iconColor: '#7c3aed', label: 'Total Users', value: '2,847', change: '+12%', changeUp: true },
        { icon: 'bx bx-store', iconBg: '#dbeafe', iconColor: '#2563eb', label: 'Active Shops', value: '186', change: '+8%', changeUp: true },
        { icon: 'bx bx-cart', iconBg: '#d1fae5', iconColor: '#059669', label: 'Orders Today', value: '342', change: '+23%', changeUp: true },
        { icon: 'bx bx-rupee', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Revenue (MTD)', value: '₹4,82,300', change: '+15%', changeUp: true },
      ];

      this.recentActivity = [
        { icon: 'bx bx-user-plus', iconBg: '#dbeafe', text: 'New owner registration: QuickPrint Nehru Place', time: '2 min ago' },
        { icon: 'bx bxs-check-circle', iconBg: '#d1fae5', text: 'Shop verified: Campus Prints, GTB Nagar', time: '15 min ago' },
        { icon: 'bx bx-alert-circle', iconBg: '#fee2e2', text: 'Order dispute raised by customer #1247', time: '32 min ago' },
        { icon: 'bx bx-store', iconBg: '#fef3c7', text: 'New shop registered: Digital Café & Print', time: '1 hr ago' },
        { icon: 'bx bx-user-check', iconBg: '#ede9fe', text: 'User verified email: rahul.sharma@gmail.com', time: '2 hr ago' },
      ];

      this.pendingVerifications = [
        { shopName: 'PrintZone Express', ownerName: 'Rajesh Gupta', city: 'Mumbai', submittedAt: '2 hours ago' },
        { shopName: 'DocuPrint Hub', ownerName: 'Anjali Mehta', city: 'Pune', submittedAt: '5 hours ago' },
        { shopName: 'FastCopy Center', ownerName: 'Vikram Singh', city: 'Delhi', submittedAt: '1 day ago' },
      ];

      this.ordersToday = { completed: 245, active: 67, cancelled: 12, processing: 18 };
      this.cdr.markForCheck();
      return;
    }

    this.adminApi.getStats().subscribe(data => {
      this.stats = [
        { icon: 'bx bx-group', iconBg: '#ede9fe', iconColor: '#7c3aed', label: 'Total Users', value: data.totalUsers.toLocaleString(), change: '', changeUp: true },
        { icon: 'bx bx-store', iconBg: '#dbeafe', iconColor: '#2563eb', label: 'Active Shops', value: data.verifiedShops.toLocaleString(), change: '', changeUp: true },
        { icon: 'bx bx-cart', iconBg: '#d1fae5', iconColor: '#059669', label: 'Total Orders', value: data.totalOrders.toLocaleString(), change: '', changeUp: true },
        { icon: 'bx bxs-shield-quarter', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Pending Verifications', value: data.pendingVerifications.toLocaleString(), change: '', changeUp: false },
      ];
      this.cdr.markForCheck();
    });
  }
}