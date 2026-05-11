import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ApiRoutes } from '../../config/api-routes';
import { environment } from '../../environment/environment';
import { LoginDetails } from '../../models/login-details';
import { Observable } from 'rxjs';
import { sign } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoginMode = signal(false);
  private totalSteps: number = 3;
  currentStep = signal(2);
  isSuccess = signal(false);

  constructor(private _http: HttpClient) {}

  next(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((step) => step + 1);
    }
  }

  back(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  getTotalSteps(): number{
    return this.totalSteps;
  }

  setIsLoginMode(val: boolean): void {
    this.isLoginMode.set(val);
  }

  setIsSuccess(val: boolean): void {
    this.isSuccess.set(val);
  }

  //#region API calls
  
  login(loginDetails: LoginDetails): Observable<any> {
    return this._http.post(`${ApiRoutes.login()}`, loginDetails);
  }
  //#endregion
}
