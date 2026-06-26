import { Routes } from '@angular/router';
import { adminGuard, customerGuard, guestGuard, ownerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // — Public routes —
  {
    path: '',
    canActivate: [customerGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'owner/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/owner/owner-login/owner-login.component').then(
        (m) => m.OwnerLoginComponent,
      ),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
  },
  {
    path: 'owner/register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/owner/owner-register/owner-register.component').then(m => m.OwnerRegisterComponent),
  },

  // — Customer routes (requires login + customer role) —
  {
    path: 'customer/upload',
    canActivate: [customerGuard],
    loadComponent: () =>
      import('./pages/upload/upload-page.component').then(
        (m) => m.UploadPageComponent,
      ),
  },
  {
    path: 'customer/orders',
    canActivate: [customerGuard],
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'customer/saved',
    canActivate: [customerGuard],
    loadComponent: () =>
      import('./pages/saved/saved.component').then((m) => m.SavedComponent),
  },
  {
    path: 'customer/profile',
    canActivate: [customerGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'owner',
    canActivate: [ownerGuard],
    loadComponent: () =>
      import('./shared/components/owner-layout/owner-layout.component').then(
        m => m.OwnerLayoutComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        loadComponent: () =>
          import('./pages/owner/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent),
      },
      {
        path: 'orders',
        data: { title: 'Orders' },
        loadComponent: () =>
          import('./pages/owner/owner-orders/owner-orders.component').then(m => m.OwnerOrdersComponent),
      },
      {
        path: 'printers',
        data: { title: 'Printers' },
        loadComponent: () =>
          import('./pages/owner/owner-printers/owner-printers.component').then(m => m.OwnerPrintersComponent),
      },
      {
        path: 'shop-settings',
        data: { title: 'Shop Settings' },
        loadComponent: () =>
          import('./pages/owner/owner-shop-settings/owner-shop-settings.component').then(m => m.OwnerShopSettingsComponent),
      },
      {
        path: 'analytics/revenue',
        data: { title: 'Revenue' },
        loadComponent: () =>
          import('./pages/owner/analytics/revenue/revenue.component').then(m => m.RevenueComponent),
      },
      {
        path: 'analytics/customers',
        data: { title: 'Customers' },
        loadComponent: () =>
          import('./pages/owner/analytics/customers/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'analytics/reviews',
        data: { title: 'Reviews' },
        loadComponent: () =>
          import('./pages/owner/analytics/reviews/reviews.component').then(m => m.ReviewsComponent),
      },
    ],
  },
  // — Admin routes (requires admin role) —
  {
    path: 'admin/dashboard',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/users/users.component').then(m => m.AdminUsersComponent),
  },
  {
    path: 'admin/shops',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/shops/shops.component').then(m => m.AdminShopsComponent),
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/orders/orders.component').then(m => m.AdminOrdersComponent),
  },
  {
    path: 'admin/verifications',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/verifications/verifications.component').then(m => m.AdminVerificationsComponent),
  },
  {
    path: 'admin/audit-log',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/audit-log/audit-log.component').then(m => m.AdminAuditLogComponent),
  },
  {
    path: 'admin/analytics',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/analytics/analytics.component').then(m => m.AdminAnalyticsComponent),
  },
  {
    path: 'admin/settings',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/settings/settings.component').then(m => m.AdminSettingsComponent),
  },
  {path: '**', redirectTo: ''}
];
