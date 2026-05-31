import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, TemplateRef, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { OwnerTopbarService } from '../../../../core/services/owner-topbar.service';
import { environment } from '../../../../environment/environment';

interface DailyRevenue {
  day: string;
  amount: number;
}

interface TopService {
  name: string;
  revenue: number;
  orders: number;
  percent: number;
  color: string;
}

interface RecentTransaction {
  id: string;
  customer: string;
  avatar: string;
  bg: string;
  amount: number;
  time: string;
  method: string;
}

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, ChartCardComponent],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly topbar = inject(OwnerTopbarService);

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  period = 'week';

  stats: { icon: string; iconBg: string; iconColor: string; label: string; value: string; trend: string; trendUp: boolean; }[] = [];
  dailyRevenue: DailyRevenue[] = [];
  topServices: TopService[] = [];
  recentTransactions: RecentTransaction[] = [];

  ngOnInit(): void {
    if (environment.useMockData) {
      this.stats = [
        { icon: 'bx bx-rupee', iconBg: '#ccfbf1', iconColor: '#0d9488', label: 'Total Revenue', value: '₹24,850', trend: '+12.5% vs last week', trendUp: true },
        { icon: 'bx bx-receipt', iconBg: '#dbeafe', iconColor: '#2563eb', label: 'Avg. Order Value', value: '₹185', trend: '+8.2%', trendUp: true },
        { icon: 'bx bx-trending-up', iconBg: '#f3e8ff', iconColor: '#7c3aed', label: 'Highest Day', value: '₹5,200', trend: 'Wednesday', trendUp: true },
        { icon: 'bx bx-cart', iconBg: '#fef3c7', iconColor: '#d97706', label: 'Total Orders', value: '134', trend: '+18 vs last week', trendUp: true }
      ];

      this.dailyRevenue = [
        { day: 'Mon', amount: 3200 },
        { day: 'Tue', amount: 2800 },
        { day: 'Wed', amount: 5200 },
        { day: 'Thu', amount: 4100 },
        { day: 'Fri', amount: 3950 },
        { day: 'Sat', amount: 3800 },
        { day: 'Sun', amount: 1800 }
      ];

      this.topServices = [
        { name: 'B&W Printing', revenue: 9800, orders: 72, percent: 39, color: '#0d9488' },
        { name: 'Color Printing', revenue: 7200, orders: 35, percent: 29, color: '#2563eb' },
        { name: 'Binding (Spiral)', revenue: 3600, orders: 18, percent: 14, color: '#7c3aed' },
        { name: 'Binding (Hard)', revenue: 2800, orders: 5, percent: 11, color: '#d97706' },
        { name: 'Lamination', revenue: 1450, orders: 4, percent: 7, color: '#059669' }
      ];

      this.recentTransactions = [
        { id: 'PH-2026-0044', customer: 'Arjun Mehta', avatar: 'AM', bg: '#0d9488', amount: 126, time: '2 min ago', method: 'UPI' },
        { id: 'PH-2026-0043', customer: 'Priya Sharma', avatar: 'PS', bg: '#7c3aed', amount: 288, time: '8 min ago', method: 'Cash' },
        { id: 'PH-2026-0042', customer: 'Rahul Verma', avatar: 'RV', bg: '#2563eb', amount: 12, time: '15 min ago', method: 'UPI' },
        { id: 'PH-2026-0041', customer: 'Sneha Kapoor', avatar: 'SK', bg: '#d97706', amount: 840, time: '32 min ago', method: 'Card' },
        { id: 'PH-2026-0040', customer: 'Vikram Patel', avatar: 'VP', bg: '#059669', amount: 192, time: '1 hr ago', method: 'UPI' }
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

  get maxRevenue(): number {
    return Math.max(...this.dailyRevenue.map(d => d.amount));
  }

  getBarHeight(amount: number): string {
    return ((amount / this.maxRevenue) * 100) + '%';
  }

  switchPeriod(p: string): void {
    this.period = p;
    this.cdr.markForCheck();
  }
}