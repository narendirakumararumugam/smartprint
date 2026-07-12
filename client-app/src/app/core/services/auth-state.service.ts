import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WebSocketService } from './web-socket.service';

export interface AuthUser {
  id?: string;
  email: string;
  fullName: string;
  userType: string; // 'customer' | 'owner' | 'admin'
  username?: string;
  avatar?: string;
  createdAt?: string; // ISO date string
  shopId?: number;
  shopName?: string;
}

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

  constructor(private wsService: WebSocketService){
    if(this.isBrowser && this.userSubject.value){
      wsService.connect();
    }
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  get userType(): string | null {
    return this.currentUser?.userType ?? null;
  }

  setSession(user: AuthUser): void {
    if (!this.isBrowser) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);

    this.wsService.connect();
  }

  /**
   * Clear session and redirect to login.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(USER_KEY);
    }

    this.wsService.disconnect();
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