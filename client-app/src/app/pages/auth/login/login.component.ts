import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;

  emailError = '';
  passwordError = '';

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

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        
        // Navigate based on user type
        const userType = res.userType;
        if (userType === 'owner') {
          this.router.navigate(['/owner/dashboard']);
        } else if (userType === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/customer/upload']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Invalid email or password.';
        this.passwordError = msg;
        this.cdr.markForCheck();
      },
    });
  }

  socialLogin(provider: string): void {
    console.log('Social login with:', provider);
  }
}