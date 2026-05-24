import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable()
export abstract class BaseApiService {
  protected abstract readonly resourcePath: string;

  constructor(protected readonly http: HttpClient) {}

  protected get baseUrl(): string {
    return `${environment.apiBaseUrl}/${this.resourcePath}`;
  }

  private buildUrl(endpoint: string): string {
    return endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl;
  }

  /**
   * Performs a GET request. Falls back to mock data if the API fails/returns empty
   * and the testing flag is enabled.
   */
  protected apiGet<T>(endpoint: string, mockData: T): Observable<T> {
    const url = this.buildUrl(endpoint);
    if (environment.useMockData) {
      return this.http.get<T>(url).pipe(
        map(res => this.isEmpty(res) ? mockData : res),
        catchError(() => of(mockData))
      );
    }
    return this.http.get<T>(url);
  }

  /**
   * Performs a POST request with the same fallback pattern.
   */
  protected apiPost<T>(endpoint: string, body: unknown, mockData: T): Observable<T> {
    const url = this.buildUrl(endpoint);
    if (environment.useMockData) {
      return this.http.post<T>(url, body).pipe(
        map(res => this.isEmpty(res) ? mockData : res),
        catchError(() => of(mockData))
      );
    }
    return this.http.post<T>(url, body);
  }

  /**
   * Performs a PUT request with the same fallback pattern.
   */
  protected apiPut<T>(endpoint: string, body: unknown, mockData: T): Observable<T> {
    const url = this.buildUrl(endpoint);
    if (environment.useMockData) {
      return this.http.put<T>(url, body).pipe(
        map(res => this.isEmpty(res) ? mockData : res),
        catchError(() => of(mockData))
      );
    }
    return this.http.put<T>(url, body);
  }

  /**
   * Performs a DELETE request with the same fallback pattern.
   */
  protected apiDelete<T>(endpoint: string, mockData: T): Observable<T> {
    const url = this.buildUrl(endpoint);
    if (environment.useMockData) {
      return this.http.delete<T>(url).pipe(
        map(res => this.isEmpty(res) ? mockData : res),
        catchError(() => of(mockData))
      );
    }
    return this.http.delete<T>(url);
  }

  private isEmpty(value: unknown): boolean {
    if (value === null) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value as object).length === 0) return true;
    return false;
  }
}