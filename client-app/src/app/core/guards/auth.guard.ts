import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

function getDefaultRoute(userType: string | null): string {
  if (userType === 'owner') return '/owner/dashboard';
  if (userType === 'admin') return '/admin/dashboard';
  return '/customer/upload';
}

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false; // Prevent access on the server
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isLoggedIn) {
    return true; // Allow access if logged in
  }
  return router.createUrlTree(['/login']);
};

export const customerGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false; // Prevent access on the server
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isLoggedIn) {
    return router.createUrlTree(['/login']); // Redirect to login if not logged in
  }
  if (authState.userType !== 'owner' && authState.userType !== 'admin')
    return true;
  return router.createUrlTree([getDefaultRoute(authState.userType)]);
};

export const ownerGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false; // Prevent access on the server
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isLoggedIn) {
    return router.createUrlTree(['/login']); // Redirect to login if not logged in
  }
  if (authState.userType == 'owner') return true;
  return router.createUrlTree([getDefaultRoute(authState.userType)]);
};

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false; // Prevent access on the server
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isLoggedIn) {
    return router.createUrlTree(['/login']); // Redirect to login if not logged in
  }
  if (authState.userType == 'admin') return true;
  return router.createUrlTree([getDefaultRoute(authState.userType)]);
};

export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isLoggedIn) {
    return true;
  }
  return router.createUrlTree([getDefaultRoute(authState.userType)]);
};
