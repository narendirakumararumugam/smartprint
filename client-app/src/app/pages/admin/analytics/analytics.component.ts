import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAnalyticsComponent implements OnInit {
  private readonly title = inject(Title);

  stats: { label: string; value: string; change: string; icon: string; color: string }[] = [];
  topShops: { name: string; city: string; orders: number; revenue: string }[] = [];
  revenueByCity: { city: string; revenue: string; percent: number }[] = [];

  ngOnInit(): void {
    this.title.setTitle('Analytics - SmartPrint Admin');
    if (environment.useMockData) {
      this.stats = [
        { label: 'Total Revenue', value: '₹4,52,300', change: '+12%', icon: 'bx bx-rupee', color: 'green' },
        { label: 'Total Orders', value: '2,847', change: '+8%', icon: 'bx bx-package', color: 'blue' },
        { label: 'Active Users', value: '1,203', change: '+15%', icon: 'bx bx-user', color: 'purple' },
        { label: 'Active Shops', value: '86', change: '+4%', icon: 'bx bx-store', color: 'amber' },
      ];
      this.topShops = [
        { name: 'QuickPrint Hub', city: 'Delhi', orders: 342, revenue: '₹89,400' },
        { name: 'PrintZone Express', city: 'Mumbai', orders: 287, revenue: '₹72,100' },
        { name: 'FastCopy Center', city: 'Delhi', orders: 215, revenue: '₹54,800' },
        { name: 'DocuPrint Hub', city: 'Pune', orders: 183, revenue: '₹41,200' },
        { name: 'CopyKing', city: 'Bangalore', orders: 156, revenue: '₹38,900' },
      ];
      this.revenueByCity = [
        { city: 'Delhi', revenue: '₹1,54,200', percent: 34 },
        { city: 'Mumbai', revenue: '₹1,12,800', percent: 25 },
        { city: 'Bangalore', revenue: '₹78,500', percent: 17 },
        { city: 'Pune', revenue: '₹61,200', percent: 14 },
        { city: 'Others', revenue: '₹45,600', percent: 10 },
      ];
    }
  }
}