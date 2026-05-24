import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { AuthService } from '../../../core/services/auth.service';

interface Avatar {
  emoji: string;
  bg: string;
  selected: boolean;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthLayoutComponent, DropdownComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  currentStep = 1;
  isLoading = false;
  showSuccess = false;

  // Step 1
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  // Step 2
  username = '';
  city = '';
  userType = '';
  bio = '';
  selectedAvatar = -1;
  avatars: Avatar[] = [
    { emoji: '👨‍💻', bg: '#e0e7ff', selected: false },
    { emoji: '👩‍💻', bg: '#fce7f3', selected: false },
    { emoji: '🧑‍💼', bg: '#d1fae5', selected: false },
    { emoji: '🕵️', bg: '#fef3c7', selected: false },
    { emoji: '🧑‍🎨', bg: '#ede9fe', selected: false },
    { emoji: '👩‍🎤', bg: '#cffafe', selected: false },
    { emoji: '🧙', bg: '#ffedd5', selected: false },
    { emoji: '🥷', bg: '#f3e8ff', selected: false },
  ];

  // Step 3
  interests = [
    { label: 'Notes & Assignments', icon: 'bx-file', selected: false },
    { label: 'ID & Forms', icon: 'bx-id-card', selected: false },
    { label: 'Photos', icon: 'bx-image', selected: false },
    { label: 'Resumes', icon: 'bx-briefcase', selected: false },
    { label: 'Posters & Banners', icon: 'bx-layout', selected: false },
    { label: 'Thesis / Projects', icon: 'bx-book', selected: false },
    { label: 'Business Cards', icon: 'bx-credit-card', selected: false },
    { label: 'Stickers & Labels', icon: 'bx-purchase-tag', selected: false },
  ];
  prefColor = 'Black & White';
  prefSides = 'Double Sided';
  prefPaper = 'A4';
  prefBinding = 'Spiral Binding';
  agreeTerms = false;

  readonly userTypeOptions: DropdownOption[] = [
    { label: 'Student', value: 'Student' },
    { label: 'Working Professional', value: 'Working Professional' },
    { label: 'Business Owner', value: 'Business Owner' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Other', value: 'Other' },
  ];

  readonly colorModeOptions: DropdownOption[] = [
    { label: 'Black & White', value: 'Black & White' },
    { label: 'Color', value: 'Color' },
  ];

  readonly sidesOptions: DropdownOption[] = [
    { label: 'Single Sided', value: 'Single Sided' },
    { label: 'Double Sided', value: 'Double Sided' },
  ];

  readonly paperSizeOptions: DropdownOption[] = [
    { label: 'A4', value: 'A4' },
    { label: 'A3', value: 'A3' },
    { label: 'A5', value: 'A5' },
    { label: 'Letter', value: 'Letter' },
  ];

  readonly bindingOptions: DropdownOption[] = [
    { label: 'None', value: 'None' },
    { label: 'Spiral Binding', value: 'Spiral Binding' },
    { label: 'Hard Binding', value: 'Hard Binding' },
  ];

  // Errors
  errors: Record<string, string> = {};

  get passwordStrength(): { level: number; label: string } {
    const pw = this.password;
    if (!pw) return { level: 0, label: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 2) return { level: 1, label: 'Weak' };
    if (score <= 3) return { level: 2, label: 'Fair' };
    if (score <= 4) return { level: 3, label: 'Strong' };
    return { level: 4, label: 'Very Strong' };
  }

  selectAvatar(idx: number): void {
    this.avatars.forEach((a, i) => a.selected = i === idx);
    this.selectedAvatar = idx;
    delete this.errors['avatar'];
  }

  toggleInterest(idx: number): void {
    this.interests[idx].selected = !this.interests[idx].selected;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  nextStep(): void {
    this.errors = {};
    if (this.currentStep === 1 && !this.validateStep1()) return;
    if (this.currentStep === 2 && !this.validateStep2()) return;
    if (this.currentStep === 3) {
      this.submitSignup();
      return;
    }
    this.currentStep++;
    this.cdr.markForCheck();
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
    this.cdr.markForCheck();
  }

  private validateStep1(): boolean {
    if (!this.firstName.trim()) this.errors['firstName'] = 'First name is required.';
    if (!this.lastName.trim()) this.errors['lastName'] = 'Last name is required.';
    if (!this.email || !this.email.includes('@')) this.errors['email'] = 'Enter a valid email.';
    if (!this.password || this.password.length < 6) this.errors['password'] = 'Password must be at least 6 characters.';
    if (this.password !== this.confirmPassword) this.errors['confirmPassword'] = 'Passwords do not match.';
    this.cdr.markForCheck();
    return Object.keys(this.errors).length === 0;
  }

  private validateStep2(): boolean {
    if (!this.username.trim()) this.errors['username'] = 'Username is required.';
    if (this.selectedAvatar < 0) this.errors['avatar'] = 'Please pick an avatar.';
    this.cdr.markForCheck();
    return Object.keys(this.errors).length === 0;
  }

  private submitSignup(): void {
    if (!this.agreeTerms) {
      this.errors['terms'] = 'You must agree to the terms.';
      this.cdr.markForCheck();
      return;
    }
    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.signup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone || undefined,
      password: this.password,
      role: 'customer',
      username: this.username.trim() || undefined,
      avatar: this.selectedAvatar >= 0 ? this.avatars[this.selectedAvatar].emoji : undefined,
      city: this.city.trim() || undefined,
      bio: this.bio.trim() || undefined,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.accessToken) {
          this.showSuccess = true;
          this.cdr.markForCheck();
          // Navigate to home after brief delay
          setTimeout(() => this.router.navigate(['/customer/upload']), 1500);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errors['terms'] = err?.error?.message || 'Signup failed. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  socialSignup(provider: string): void{
    console.log("social signup");
  }
}
