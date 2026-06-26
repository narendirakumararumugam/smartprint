import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  AuthStateService,
  AuthUser,
} from '../../../core/services/auth-state.service';
import { OwnerTopbarService } from '../../../core/services/owner-topbar.service';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';

export interface SidebarLink {
  icon: string;
  label: string;
  route: string;
  badge?: number;
  badgeTeal?: boolean;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './owner-layout.component.html',
  styleUrl: './owner-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerLayoutComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authState = inject(AuthStateService);
  readonly topbar = inject(OwnerTopbarService);
  private readonly host = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  pageTitle = '';
  ownerName = '';
  ownerEmail = '';
  ownerInitial = '?';
  shopName = 'My Shop';
  userMenuOpen = false;

  readonly sections: SidebarSection[] = [
    {
      title: 'Main',
      links: [
        {
          icon: 'bx bx-tachometer',
          label: 'Dashboard',
          route: '/owner/dashboard',
        },
        { icon: 'bx bx-cart', label: 'Orders', route: '/owner/orders' },
        { icon: 'bx bx-printer', label: 'Printers', route: '/owner/printers' },
        {
          icon: 'bx bx-store',
          label: 'Shop Settings',
          route: '/owner/shop-settings',
        },
      ],
    },
    {
      title: 'Analytics',
      links: [
        {
          icon: 'bx bx-line-chart',
          label: 'Revenue',
          route: '/owner/analytics/revenue',
        },
        {
          icon: 'bx bx-group',
          label: 'Customers',
          route: '/owner/analytics/customers',
        },
        {
          icon: 'bx bxs-star',
          label: 'Reviews',
          route: '/owner/analytics/reviews',
        },
      ],
    },
  ];

  constructor(private authService :AuthService) {
    this.authState.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.applyUser(user));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.collectTitle(this.route.snapshot)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((title) => {
        this.pageTitle = title;
        this.cdr.markForCheck();
      });

    this.pageTitle = this.collectTitle(this.route.snapshot);

    this.topbar.actionsTemplate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    this.topbar.shopOpen$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    this.topbar.shopClosesAt$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    this.topbar.pendingOrders$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  private applyUser(user: AuthUser | null): void {
    if (user) {
      this.ownerName = user.fullName || 'Owner';
      this.ownerEmail = user.email || '';
      this.ownerInitial = (
        user.fullName?.trim().charAt(0) ||
        user.email?.charAt(0) ||
        '?'
      ).toUpperCase();
    } else {
      this.ownerName = '';
      this.ownerEmail = '';
      this.ownerInitial = '?';
    }
    this.cdr.markForCheck();
  }

  private collectTitle(snapshot: ActivatedRouteSnapshot): string {
    let title = '';
    let cursor: ActivatedRouteSnapshot | null = snapshot;
    while (cursor) {
      if (cursor.data && typeof cursor.data['title'] === 'string') {
        title = cursor.data['title'] as string;
      }
      cursor = cursor.firstChild;
    }
    return title;
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    this.cdr.markForCheck();
  }

  closeUserMenu(): void {
    if (this.userMenuOpen) {
      this.userMenuOpen = false;
      this.cdr.markForCheck();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.userMenuOpen) return;
    const target = event.target as Node;
    if (!this.host.nativeElement.contains(target)) {
      this.closeUserMenu();
    }
  }

  goToProfile(): void {
    this.closeUserMenu();
    this.router.navigateByUrl('/owner/shop-settings');
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}
