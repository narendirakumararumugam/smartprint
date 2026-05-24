import { Injectable } from "@angular/core";
import { RESOURCE_PATHS } from "../constants/api-endpoints";
import { environment } from "../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  userType: string;
  username?: string;
  createdAt?: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
// Note: File contents cut off after the Injectable decorator
export class ProfileService {
  private readonly baseUrl = `${environment.apiBaseUrl}/${RESOURCE_PATHS.PROFILE}`;

  constructor(private readonly http: HttpClient) { }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.baseUrl);
  }

  updateProfile(request: ProfileUpdateRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.baseUrl, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/change-password`, request);
  }
}
