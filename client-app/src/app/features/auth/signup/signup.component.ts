import { Component, effect } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AccountCreationComponent } from "../account-creation/account-creation.component";
import { ProfileCreationComponent } from "../profile-creation/profile-creation.component";
import { PreferencesSetupComponent } from "../preferences-setup/preferences-setup.component";
import { AuthService } from '../../../core/services/auth.service';
import { SetupSuccessComponent } from '../setup-success/setup-success.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AccountCreationComponent, ProfileCreationComponent, PreferencesSetupComponent, SetupSuccessComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  currentStep = this._authService.currentStep;
  totalSteps = this._authService.getTotalSteps();
  isSuccess = this._authService.isSuccess;

  constructor(private _authService: AuthService){
    effect(() => {
      console.log('Current Step:', this.currentStep());
      console.log('Is Success:', this.isSuccess());
    });
  }

}
