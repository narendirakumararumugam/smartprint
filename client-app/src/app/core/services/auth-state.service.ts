import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthUser {
  id?: string;
  email: string;
  fullName: string;
  userType: string; // 'customer' | 'owner' | 'admin'
  username?: string;
  avatar?: string;
  createdAt?: string; // ISO date string
}

const TOKEN_KEY = 'sp_access_token';
const REFRESH_KEY = 'sp_refresh_token';
const USER_KEY = 'sp_user';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  readonly user$ = this.userSubject.asObservable();

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  get userType(): string | null {
    return this.currentUser?.userType ?? null;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(REFRESH_KEY);
  }

  /**
   * Store auth tokens + user info after successful login/signup.
   */
  setSession(accessToken: string, refreshToken: string, user: AuthUser): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  /**
   * Clear session and redirect to login.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private loadUser(): AuthUser | null {
    if (!this.isBrowser) return null;
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }
}