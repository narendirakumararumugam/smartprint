import { Component, inject, ChangeDetectionStrategy, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Router, RouterLink } from '@angular/router';

export interface AdminSidebarLink {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

export interface AdminSidebarSection {
  title: string;
  links: AdminSidebarLink[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  @Input() pageTitle = 'Dashboard';
  @Input() adminName = 'Admin';
  @Input() adminEmail = 'admin@smartprint.in';
  @Input() activeRoute = '';
  @Input() pendingVerifications = 0;

  sections: AdminSidebarSection[] = [
    {
      title: 'Overview',
      links: [
        { icon: 'bx bx-tachometer', label: 'Dashboard', route: '/admin/dashboard' },
        { icon: 'bx bx-bar-chart-big', label: 'Analytics', route: '/admin/analytics' },
      ],
    },
    {
      title: 'Management',
      links: [
        { icon: 'bx bx-group', label: 'Users', route: '/admin/users' },
        { icon: 'bx bx-store', label: 'Shops', route: '/admin/shops' },
        { icon: 'bx bx-cart', label: 'Orders', route: '/admin/orders' },
        { icon: 'bx bx-check-shield', label: 'Verifications', route: '/admin/verifications' },
      ],
    },
    {
      title: 'System',
      links: [
        { icon: 'bx bx-history', label: 'Audit Log', route: '/admin/audit-log' },
        { icon: 'bx bx-cog', label: 'Settings', route: '/admin/settings' },
      ],
    },
  ];

  isActive(route: string): boolean {
    if (this.activeRoute) return route === this.activeRoute;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}