import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-creation',
  standalone: true,
  imports: [],
  templateUrl: './profile-creation.component.html',
  styleUrl: './profile-creation.component.css',
})
export class ProfileCreationComponent {
  constructor(private _authService: AuthService) {}

  goToNextStep() {
    this._authService.next();
  }

  goToPreviousStep() {
    this._authService.back();
  }
}
