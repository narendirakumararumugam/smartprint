import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MESSAGES } from '../../../core/constants/messages';
import { OwnerAuthService } from '../../../core/services/owner-auth.service';
import { OwnerAuthLayoutComponent } from '../../../shared/components/owner-auth-layout/owner-auth-layout.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { InlineMapPickerComponent } from '../../../shared/components/inline-map-picker/inline-map-picker.component';
import { ToastService } from '../../../core/services/toast.service';
import { AVAILABLE_SERVICES, DEFAULT_HOURS, DEFAULT_PRICING, MAX_FILE_SIZE_OPTIONS, NotificationPreferences, ServiceOption, ShopHourEntry, ShopPricing } from '../../../models/owner-register.model';
import { UserLocation } from '../../../models/location.model';

@Component({
  selector: 'app-owner-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    OwnerAuthLayoutComponent, 
    ToastContainerComponent, 
    DropdownComponent, 
    InlineMapPickerComponent
  ],
  templateUrl: './owner-register.component.html',
  styleUrl: './owner-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerRegisterComponent {
  private readonly ownerAuthService = inject(OwnerAuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly title = inject(Title);

  currentStep = 1;
  isLoading = false;
  showSuccess = false;
  registeredShopName = '';

  // Step 1: Account
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  whatsapp = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  // Step 2: Shop Details
  shopName = '';
  tagline = '';
  address = '';
  city = '';
  pinCode = '';
  latitude: number | null = null;
  longitude: number | null = null;
  services: ServiceOption[] = AVAILABLE_SERVICES.map(s => ({ ...s }));
  hours: ShopHourEntry[] = DEFAULT_HOURS.map(h => ({ ...h }));
  pricing: ShopPricing = { ...DEFAULT_PRICING };

  // Step 3: Setup
  approvalMode: 'manual' | 'auto' = 'manual';
  printerModel = '';
  printerConnection = '';
  
  readonly connectionTypeOptions: DropdownOption[] = [
    { label: 'USB (Local)', value: 'USB (Local)' },
    { label: 'Network / LAN', value: 'Network / LAN' },
    { label: 'Wi-Fi', value: 'Wi-Fi' },
    { label: 'Cloud Print', value: 'Cloud Print' },
  ];
  
  printerIP = '';
  maxFileSize = '100 MB';
  maxFileSizeOptions = MAX_FILE_SIZE_OPTIONS;
  readonly fileSizeOptions: DropdownOption[] = MAX_FILE_SIZE_OPTIONS.map(o => ({ label: o, value: o }));
  
  notifications: NotificationPreferences = {
    email: true,
    whatsapp: true,
    push: true,
    dailySummary: false,
  };
  
  agreeTerms = false;

  // Errors
  errors: Record<string, string> = {};

  constructor() {
    this.title.setTitle('Register Your Shop – SmartPrint for Owners');
  }

  get passwordStrength(): { level: number; label: string; cls: string } {
    const pw = this.password;
    if (!pw) return { level: 0, label: '', cls: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const cls = score <= 1 ? 'weak' : score <= 2 ? 'fair' : 'strong';
    return { level: score, label: labels[score], cls };
  }

  get selectedServices(): string[] {
    return this.services.filter(s => s.selected).map(s => s.label);
  }

  // — Stepper —
  goToStep(step: number): void {
    this.currentStep = step;
    this.cdr.markForCheck();
  }

  nextStep(): void {
    if (this.currentStep === 1 && !this.validateStep1()) return;
    if (this.currentStep === 2 && !this.validateStep2()) return;
    this.currentStep++;
    this.cdr.markForCheck();
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.markForCheck();
    }
  }

  toggleService(svc: ServiceOption): void {
    svc.selected = !svc.selected;
    this.clearError('services');
  }

  // — Hours toggle —
  toggleDayClosed(hour: ShopHourEntry): void {
    hour.isClosed = !hour.isClosed;
    if (hour.isClosed) {
      hour.open = '';
      hour.close = '';
    } else {
      hour.open = '09:00';
      hour.close = '20:00';
    }
  }

  getDayShort(day: string): string {
    return day.substring(0, 3);
  }

  // — Approval mode —
  selectApprovalMode(mode: 'manual' | 'auto'): void {
    this.approvalMode = mode;
  }

  // — Validation —
  validateStep1(): boolean {
    this.errors = {};
    if (!this.firstName.trim()) this.errors['firstName'] = 'First name is required.';
    if (!this.lastName.trim()) this.errors['lastName'] = 'Last name is required.';
    if (!this.email.trim()) this.errors['email'] = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) this.errors['email'] = 'Enter a valid email address.';
    if (!this.phone.trim()) this.errors['phone'] = 'Mobile number is required.';
    if (!this.password) this.errors['password'] = 'Password is required.';
    else if (this.password.length < 6) this.errors['password'] = 'Minimum 6 characters required.';
    if (!this.confirmPassword) this.errors['confirmPassword'] = 'Please confirm your password.';
    else if (this.password !== this.confirmPassword) this.errors['confirmPassword'] = 'Passwords do not match.';
    
    this.cdr.markForCheck();
    return Object.keys(this.errors).length === 0;
  }

  validateStep2(): boolean {
    this.errors = {};
    if (!this.shopName.trim()) this.errors['shopName'] = 'Shop name is required.';
    if (!this.address.trim()) this.errors['address'] = 'Address is required.';
    if (!this.city.trim()) this.errors['city'] = 'City is required.';
    if (!this.pinCode.trim()) this.errors['pinCode'] = 'PIN code is required.';
    else if (!/^\d{6}$/.test(this.pinCode)) this.errors['pinCode'] = 'Enter a valid 6-digit PIN code.';
    if (this.latitude === null || this.longitude === null) this.errors['location'] = 'Please pin your shop location on the map.';
    if (this.selectedServices.length === 0) this.errors['services'] = 'Select at least one service.';
    
    this.cdr.markForCheck();
    return Object.keys(this.errors).length === 0;
  }

  onLocationPicked(loc: UserLocation): void {
    this.latitude = loc.coordinates.lat;
    this.longitude = loc.coordinates.lng;
    
    // Auto-fill empty address fields from geocoded location
    if (!this.address.trim()) this.address = loc.fullAddress;
    if (!this.city.trim() && loc.city) this.city = loc.city;
    if (!this.pinCode.trim() && loc.pincode && /^\d{6}$/.test(loc.pincode)) this.pinCode = loc.pincode;
    
    this.clearError('location');
    this.clearError('address');
    this.clearError('city');
    this.cdr.markForCheck();
  }

  validateStep3(): boolean {
    this.errors = {};
    if (!this.agreeTerms) this.errors['terms'] = 'You must agree to the partner terms.';
    this.cdr.markForCheck();
    return Object.keys(this.errors).length === 0;
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  // — Submit —
  submit(): void {
    if (!this.validateStep3()) return;

    this.isLoading = true;
    this.cdr.markForCheck();

    const request = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      whatsapp: this.whatsapp.trim() || undefined,
      password: this.password,
      shopName: this.shopName.trim(),
      tagline: this.tagline.trim() || undefined,
      address: this.address.trim(),
      city: this.city.trim(),
      pinCode: this.pinCode.trim(),
      latitude: this.latitude ?? undefined,
      longitude: this.longitude ?? undefined,
      services: this.selectedServices,
      hours: this.hours,
      pricing: this.pricing,
      approvalMode: this.approvalMode,
      printer: this.approvalMode === 'auto' ? {
        model: this.printerModel.trim(),
        connectionType: this.printerConnection,
        ipAddress: this.printerIP.trim() || undefined,
      } : undefined,
      maxFileSize: this.maxFileSize,
      notifications: this.notifications,
    };

    this.ownerAuthService.register(request).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.showSuccess = true;
          this.registeredShopName = res.shopName || this.shopName;
          this.toastService.show(MESSAGES.OWNER.REGISTER_SUCCESS, 'success');
          if (this.approvalMode === 'auto') {
            this.toastService.show(MESSAGES.OWNER.AUTO_APPROVAL_ENABLED, 'success');
          }
        } else {
          this.toastService.show(res.message || MESSAGES.OWNER.REGISTER_FAILED, 'warning');
        }
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.isLoading = false;
        this.toastService.show(e.error.message, 'warning');
        this.cdr.markForCheck();
      }
    });
  }

  goToDashboard(): void{
    this.router.navigate(['/owner/dashboard']);
  }

  trackByIndex(index: number): number{
    return index;
  }
}