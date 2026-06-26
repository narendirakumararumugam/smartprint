import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS, RESOURCE_PATHS } from '../constants/api-endpoints';
import { AuthStateService } from './auth-state.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  OwnerRegisterRequest,
  OwnerRegisterResponse,
} from '../../models/owner-register.model';

const MOCK_REGISTER_RESPONSE: OwnerRegisterResponse = {
  success: true,
  shopId: 6,
  shopName: 'My New Shop',
  message: 'Shop registered successfully! Welcome to SmartPrint Partner.',
  accessToken: 'mock-owner-token-xyz',
  refreshToken: 'mock-owner-refresh-xyz',
};

@Injectable({ providedIn: 'root' })
export class OwnerAuthService extends BaseApiService {
  protected readonly resourcePath = RESOURCE_PATHS.OWNER_AUTH;

  constructor(
    http: HttpClient,
    private readonly authState: AuthStateService,
  ) {
    super(http);
  }

  register(request: OwnerRegisterRequest): Observable<OwnerRegisterResponse> {
    return this.apiPost<OwnerRegisterResponse>(
      API_ENDPOINTS.OWNER_AUTH.REGISTER,
      request,
      {
        ...MOCK_REGISTER_RESPONSE,
        shopName: request.shopName,
      },
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.authState.setSession({
            email: request.email,
            fullName: `${request.firstName} ${request.lastName}`,
            userType: 'owner',
            shopId: res.shopId,
            shopName: res.shopName,
          });
        }
      }),
    );
  }

  login(request: { email: string; password: string }): Observable<OwnerRegisterResponse | { success: boolean; message?: string }> {
    // For owners we reuse the owner/auth resource path and post to 'login'.
    // Returns a similar shaped response to register for mock fallback.
    return this.apiPost<OwnerRegisterResponse | { success: boolean; message?: string }>(
      'login',
      request,
      {
        success: true,
        shopId: 6,
        shopName: 'Mock Owner Shop',
        message: 'Login successful',
        accessToken: 'mock-owner-token-xyz',
        refreshToken: 'mock-owner-refresh-xyz',
      }
    ).pipe(
      tap(res => {
        // On successful login, set session as owner
        if ((res as any).success) {
          const response = res as OwnerRegisterResponse;
          this.authState.setSession({
            email: request.email,
            fullName: request.email.split('@')[0], // Fallback to email prefix
            userType: 'owner',
            shopId: response.shopId,
            shopName: response.shopName,
          });
        }
      })
    );
  }

  checkEmailAvailable(email: string): Observable<{ available: boolean }> {
    return this.apiGet<{ available: boolean }>(
      `${API_ENDPOINTS.OWNER_AUTH.CHECK_EMAIL}?email=${encodeURIComponent(email)}`,
      { available: true },
    );
  }
}
