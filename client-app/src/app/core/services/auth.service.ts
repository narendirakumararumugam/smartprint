import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoutes } from '../../config/api-routes';
import { environment } from '../../environment/environment';
import { LoginDetails } from '../../models/login-details';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  login(loginDetails: LoginDetails): Observable<any>{
    return this._http.post(`${ApiRoutes.login()}`, loginDetails);
  }
}
