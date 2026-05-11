import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preferences-setup',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
  ],
  templateUrl: './preferences-setup.component.html',
  styleUrl: './preferences-setup.component.css',
})
export class PreferencesSetupComponent {
  currentStep: number = 0;
  printModes: string[] = ['Black & White', 'Color'];
  printSides: string[] = ['Single Sided', 'Double Sided'];
  paperSizes: string[] = ['A4', 'A3', 'A5', 'Letter'];
  bindingTypes: string[] = ['None', 'Spiral Binding', 'Hard Binding'];

  // selected values
  selectedPrintMode: string = '';
  selectedPrintSides: string = '';
  selectedPaperSize: string = '';
  selectedBindingType: string = '';

  constructor(private _authService: AuthService) {
    this.currentStep = _authService.currentStep();
  }

  goToPreviousStep() {
    this._authService.back();
  }

  goToLogin(): void{
    this._authService.setIsLoginMode(true);
  }

  signUpUser(): void {
    this._authService.setIsSuccess(true);
  }
}
