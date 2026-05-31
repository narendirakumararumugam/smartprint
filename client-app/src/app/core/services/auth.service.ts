import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { AuthStateService } from './auth-state.service';
import { API_ENDPOINTS, RESOURCE_PATHS } from '../constants/api-endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role?: string; // 'customer' | 'owner'
  username?: string;
  avatar?: string;
  city?: string;
  bio?: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  email: string;
  fullName: string;
  userType: string;
  username?: string;
  avatar?: string;
  createdAt?: string;
}

const MOCK_LOGIN_RESPONSE: AuthResponse = {
  accessToken: 'mock-jwt-token-xyz-123',
  refreshToken: 'mock-refresh-token-xyz',
  email: 'arjun@email.com',
  fullName: 'Arjun Mehta',
  userType: 'customer',
};

const MOCK_SIGNUP_RESPONSE: AuthResponse = {
  accessToken: 'mock-jwt-token-abc-456',
  refreshToken: 'mock-refresh-token-abc',
  email: 'newuser@email.com',
  fullName: 'New User',
  userType: 'customer',
};

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  protected readonly resourcePath = RESOURCE_PATHS.AUTH;

  constructor(
    http: HttpClient,
    private authState: AuthStateService,
  ) {
    super(http);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiPost<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request,
      MOCK_LOGIN_RESPONSE,
    ).pipe(
      tap((res) => {
        this.authState.setSession({
          email: res.email,
          fullName: res.fullName,
          userType: res.userType,
          username: res.username,
          avatar: res.avatar,
          createdAt: res.createdAt,
        });
      }),
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.apiPost<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      request,
      MOCK_SIGNUP_RESPONSE,
    ).pipe(
      tap((res) => {
          this.authState.setSession({
            email: res.email,
            fullName: res.fullName,
            userType: res.userType,
            username: res.username,
            avatar: res.avatar,
            createdAt: res.createdAt,
          });
      }),
    );
  }

  logout(): void {
    this.apiPost<{message: string}>(API_ENDPOINTS.AUTH.LOGOUT, {}, {message: 'Logged out'})
    .subscribe({
      next: () => this.authState.logout(),
      error: () => this.authState.logout()
    })
  }

  forgotPassword(
    email: string,
  ): Observable<{ success: boolean; message: string }> {
    return this.apiPost<{ success: boolean; message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      {
        success: true,
        message: 'If this email is registered, a reset link will be sent.',
      },
    );
  }
}
