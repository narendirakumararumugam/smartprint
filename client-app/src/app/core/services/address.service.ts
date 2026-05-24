import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly baseUrl = `${environment.apiBaseUrl}/profile/addresses`;

  constructor(private http: HttpClient) { }

  list(): Observable<Address[]>{
    return this.http.get<Address[]>(this.baseUrl);
  }

  create(addr: Address): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, addr);
  }

  update(id: string, addr: Address): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, addr);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  setDefault(id: string): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}/default`, {});
  }
}
