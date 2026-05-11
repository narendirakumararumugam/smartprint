import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { PreventDefaultDirective } from "../../../shared/directives/PreventDefaultDirective";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-account-creation',
  standalone: true,
  imports: [PreventDefaultDirective, RouterLink],
  templateUrl: './account-creation.component.html',
  styleUrl: './account-creation.component.css'
})
export class AccountCreationComponent {
  constructor(private _authService: AuthService){}

  goToNextStep(): void {
    this._authService.next();
  }

  goToLogin(): void{
    this._authService.setIsLoginMode(true);
  }
}
