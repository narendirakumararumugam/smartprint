import { Routes } from '@angular/router';
import { customerGuard, guestGuard } from './core/guards/auth.guard';

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
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
  },
  // {
  //   path: 'owner/register',
  //   canActivate: [guestGuard],
  //   loadComponent: () =>
  //     import('./pages/owner/register/owner-register.component').then(m => m.OwnerRegisterComponent),
  // },

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
];
