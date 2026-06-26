import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { OwnerAuthService } from '../../../core/services/owner-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OwnerAuthLayoutComponent } from '../../../shared/components/owner-auth-layout/owner-auth-layout.component';

@Component({
  selector: 'app-owner-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, OwnerAuthLayoutComponent],
  templateUrl: './owner-login.component.html',
  styleUrl: './owner-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerLoginComponent {
  private readonly ownerAuth = inject(OwnerAuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;

  emailError = '';
  passwordError = '';

  // Properties referenced in ngOnInit (Image 6)
  orders: any[] = [];
  authState: any; // Context indicates this handles currentUser properties
  topbar: any; // Reference to shell component layout/UI properties

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.emailError = '';
    this.passwordError = '';

    if (!this.email || !this.email.includes('@')) {
      this.emailError = 'Please enter a valid email.';
    }
    if (!this.password) {
      this.passwordError = 'Password is required.';
    }
    if (this.emailError || this.passwordError) return;

    this.isLoading = true;
    this.cdr.markForCheck();

    this.ownerAuth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        // On successful owner login, navigate to owner dashboard
        this.router.navigate(['/owner/dashboard']);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  socialLogin(provider :string): void{

  }
}