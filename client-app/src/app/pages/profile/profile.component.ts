import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MESSAGES } from '../../core/constants/messages';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfilePersonalComponent } from './profile-personal/profile-personal.component';
import { ProfileSectionsComponent } from './profile-sections/profile-sections.component';
import { ProfileModalsComponent } from './profile-modals/profile-modals.component';
import { AvatarPickerModalComponent } from '../../shared/components/avatar-picker-modal/avatar-picker-modal.component';
import { AddressFormModalComponent } from '../../shared/components/address-form-modal/address-form-modal.component';
import { ToastService } from '../../core/services/toast.service';
import { ProfileService } from '../../core/services/profile.service';
import { AddressService } from '../../core/services/address.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { Address } from '../../models/address.model';
import { environment } from '../../environment/environment';
import {
  ChangePasswordModalComponent,
  ChangePasswordPayload,
} from '../../shared/components/change-password-modal/change-password-modal.component';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';

export interface SecurityItem {
  icon: string;
  iconBg: string;
  iconClr: string;
  name: string;
  desc: string;
  status: string;
  statusCls: string;
  action: string;
}

export interface ActivityItem {
  icon: string;
  iconBg: string;
  iconClr: string;
  title: string;
  sub: string;
  time: string;
}

export interface FavShop {
  id: number;
  name: string;
  addr: string;
  rating: number;
  grad: string;
  icon: string;
}

export type SectionType =
  | 'personal'
  | 'prefs'
  | 'addresses'
  | 'security'
  | 'activity'
  | 'favourites'
  | 'danger';


const PREFS_STORAGE_KEY = 'smartprint.print-prefs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastContainerComponent,
    ProfileHeaderComponent,
    ProfileSidebarComponent,
    ProfilePersonalComponent,
    ProfileSectionsComponent,
    ProfileModalsComponent,
    AvatarPickerModalComponent,
    AddressFormModalComponent,
    ChangePasswordModalComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly profileService = inject(ProfileService);
  private readonly addressService = inject(AddressService);
  private readonly authState = inject(AuthStateService);
  private readonly title = inject(Title);

  activeSection: SectionType = 'personal';
  isEditing = false;
  showLogoutModal = false;
  showDeleteModal = false;
  showAvatarModal = false;
  showAddressModal = false;
  showPasswordModal = false;
  passwordSubmitting = false;
  passwordServerError = '';
  editingAddress: Address | null = null;

  // Personal info
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  whatsapp = '';
  gender = '';

  // Identity (loaded from API/auth)
  avatar = '';
  username = '';
  memberSince = '';

  // Stats
  totalOrders = 0;
  totalSpent = '₹0';
  pagesPrinted = '0';
  savedShops = 0;

  // Print preferences
  prefs = {
    color: 'Black & White',
    sides: 'Double Sided',
    paper: 'A4',
    copies: '1',
    binding: 'Spiral Binding',
    orientation: 'Portrait',
  };

  addresses: Address[] = [];
  securityItems: SecurityItem[] = [
    {
      icon: 'bx bxs-lock-alt',
      iconBg: '#dbeafe',
      iconClr: '#2563eb',
      name: 'Password',
      desc: 'Change your account password regularly to keep your account secure.',
      status: '',
      statusCls: '',
      action: 'Change Password',
    },
  ];
  activityItems: ActivityItem[] = [];
  favShops: FavShop[] = [];

  sideNavItems: {
    key: SectionType;
    icon: string;
    label: string;
    badge?: number;
    danger?: boolean;
  }[] = [
    { key: 'personal', icon: 'bx bx-user', label: 'Personal Info' },
    { key: 'prefs', icon: 'bx bx-slider', label: 'Print Preferences' },
    { key: 'addresses', icon: 'bx bx-map', label: 'Saved Addresses' },
    { key: 'security', icon: 'bx bx-shield', label: 'Security' },
    { key: 'activity', icon: 'bx bx-history', label: 'Activity Log' },
    { key: 'favourites', icon: 'bx bxs-heart', label: 'Favourite Shops' },
    { key: 'danger', icon: 'bx bx-error', label: 'Danger Zone', danger: true },
  ];

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.title.setTitle('My Profile - SmartPrint');
    this.loadStoredPrefs();

    if (environment.useMockData) {
      this.firstName = 'Arjun';
      this.lastName = 'Mehta';
      this.email = 'arjun.mehta@email.com';
      this.phone = '+91 98765 43210';
      this.gender = 'male';
      this.avatar = '';
      this.username = 'arjun_m';
      this.memberSince = 'Member since Apr 2025';
      this.totalOrders = 14;
      this.totalSpent = '₹3,428';
      this.pagesPrinted = '1,246';
      this.savedShops = 4;
      this.addresses = [
        {
          id: 'mock-1',
          type: 'Home',
          isDefault: true,
          name: 'Arjun Mehta',
          line1: 'B-204, Sunrise Towers',
          line2: 'Pitampura, New Delhi - 110034',
          city: 'New Delhi',
          pincode: '110034',
          phone: '+91 98765 43210',
        },
        {
          id: 'mock-2',
          type: 'College',
          isDefault: false,
          name: 'Arjun Mehta',
          line1: 'Room 14, Boys Hostel, Gate 3',
          line2: 'Delhi University, North Campus',
          city: 'New Delhi',
          pincode: '110007',
          phone: '+91 98765 43210',
        },
      ];
      this.activityItems = [
        {
          icon: 'bxs bx-box',
          iconBg: '#dbeafe',
          iconClr: '#2563eb',
          title: 'Order placed at PrintPro Express',
          sub: 'PH-2026-0042 · 3 files · ₹287',
          time: '2 hours ago',
        },
        {
          icon: 'bxs bx-heart',
          iconBg: '#fef2f2',
          iconClr: '#ef4444',
          title: 'Saved Campus Prints',
          sub: 'Added to favourites',
          time: 'Yesterday',
        },
      ];
      this.favShops = [
        {
          id: 0,
          name: 'PrintPro Express',
          addr: 'F-Block, Connaught Place',
          rating: 4.8,
          grad: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          icon: '',
        },
      ];
    } else {
      this.seedFromAuthState();
      this.loadProfile();
      this.loadAddresses();
    }
  }

  /**
   * Show whatever we already know from the active session so the UI is
   * never blank while the GET /profile request is in flight.
   */
  private seedFromAuthState(): void {
    const u = this.authState.currentUser;
    if (!u) return;
    if (u.fullName) {
      const parts = u.fullName.trim().split(/\s+/);
      this.firstName = parts[0] ?? '';
      this.lastName = parts.slice(1).join(' ');
    }
    if (u.email) this.email = u.email;
    if (u.avatar) this.avatar = u.avatar;
    if (u.username) this.username = u.username;
    if (u.createdAt) this.memberSince = this.formatMemberSince(u.createdAt);
    this.cdr.markForCheck();
  }

  private loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.firstName = p.firstName || this.firstName;
        this.lastName = p.lastName || this.lastName;
        this.email = p.email || this.email;
        this.phone = p.phone || '';
        this.whatsapp = p.whatsapp || '';
        this.avatar = p.avatar || this.avatar;
        this.username = p.username || this.username;
        this.memberSince =
          this.formatMemberSince(p.createdAt) || this.memberSince;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.LOAD_FAILED, 'warning');
        this.cdr.markForCheck();
      },
    });
  }

  private loadAddresses(): void {
    this.addressService.list().subscribe({
      next: (list) => {
        this.addresses = list || [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_LOAD_FAILED, 'warning');
      },
    });
  }

  private loadStoredPrefs(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) this.prefs = { ...this.prefs, ...JSON.parse(raw) };
    } catch {
      /* ignore corrupt prefs */
    }
  }

  private formatMemberSince(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `Member since ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
  }

  showSection(section: SectionType): void {
    this.activeSection = section;
    this.cdr.markForCheck();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (environment.useMockData) {
      this.firstName = 'Arjun';
      this.lastName = 'Mehta';
      this.email = 'arjun.mehta@email.com';
      this.phone = '+91 98765 43210';
      this.gender = 'male';
    } else {
      this.loadProfile();
    }
    this.cdr.markForCheck();
  }

  saveProfile(): void {
    if (!environment.useMockData) {
      this.profileService
        .updateProfile({
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          whatsapp: this.whatsapp,
          avatar: this.avatar,
        })
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.toastService.show(MESSAGES.PROFILE.UPDATE_SUCCESS, 'success');
            this.cdr.markForCheck();
          },
          error: () => {
            this.toastService.show(MESSAGES.PROFILE.UPDATE_FAILED, 'warning');
            this.cdr.markForCheck();
          },
        });
      return;
    }
    this.isEditing = false;
    this.toastService.show(MESSAGES.PROFILE.UPDATE_SUCCESS, 'success');
    this.cdr.markForCheck();
  }

  savePrefs(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(this.prefs));
      } catch {
        /* storage full */
      }
    }
    this.toastService.show(MESSAGES.PROFILE.PREFERENCES_SAVED, 'success');
  }

  updatePref(key: string, value: string): void {
    this.prefs = { ...this.prefs, [key]: value } as typeof this.prefs;
    this.cdr.markForCheck();
  }

  // ----- Avatar -----
  openAvatarModal(): void {
    this.showAvatarModal = true;
    this.cdr.markForCheck();
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.cdr.markForCheck();
  }

  onAvatarSelected(emoji: string): void {
    this.avatar = emoji;
    if (environment.useMockData) {
      this.toastService.show(MESSAGES.PROFILE.AVATAR_UPDATED, 'success');
      this.cdr.markForCheck();
      return;
    }
    this.profileService.updateProfile({ avatar: emoji }).subscribe({
      next: () => {
        this.toastService.show(MESSAGES.PROFILE.AVATAR_UPDATED, 'success');
        this.cdr.markForCheck();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.UPDATE_FAILED, 'warning');
        this.cdr.markForCheck();
      },
    });
  }

  // ----- Addresses (server-backed when useMockData=false) -----
  openAddAddressModal(): void {
    this.editingAddress = null;
    this.showAddressModal = true;
    this.cdr.markForCheck();
  }

  openEditAddressModal(addr: Address): void {
    this.editingAddress = addr;
    this.showAddressModal = true;
    this.cdr.markForCheck();
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    this.editingAddress = null;
    this.cdr.markForCheck();
  }
  onAddressSaved(addr: Address): void {
    if (environment.useMockData) {
      if (this.editingAddress?.id) {
        this.addresses = this.addresses.map((a) =>
          a.id === this.editingAddress!.id
            ? { ...addr, id: a.id, isDefault: a.isDefault }
            : a,
        );
      } else {
        const newId = `local-${Date.now()}`;
        this.addresses = [
          ...this.addresses,
          { ...addr, id: newId, isDefault: this.addresses.length === 0 },
        ];
      }
      this.toastService.show(MESSAGES.PROFILE.ADDRESS_ADDED, 'success');
      this.closeAddressModal();
      return;
    }

    const op = this.editingAddress?.id
      ? this.addressService.update(this.editingAddress.id, addr)
      : this.addressService.create(addr);

    op.subscribe({
      next: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_ADDED, 'success');
        this.closeAddressModal();
        this.loadAddresses();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_SAVE_FAILED, 'warning');
        this.cdr.markForCheck();
      },
    });
  }

  setDefaultAddress(id: string): void {
    if (environment.useMockData) {
      this.addresses = this.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      this.toastService.show(MESSAGES.PROFILE.ADDRESS_UPDATED, 'success');
      this.cdr.markForCheck();
      return;
    }

    this.addressService.setDefault(id).subscribe({
      next: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_UPDATED, 'success');
        this.loadAddresses();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_SAVE_FAILED, 'warning');
      },
    });
  }

  removeAddress(id: string): void {
    if (environment.useMockData) {
      this.addresses = this.addresses.filter((a) => a.id !== id);
      this.toastService.show(MESSAGES.PROFILE.ADDRESS_REMOVED, 'info');
      this.cdr.markForCheck();
      return;
    }

    this.addressService.delete(id).subscribe({
      next: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_REMOVED, 'info');
        this.loadAddresses();
      },
      error: () => {
        this.toastService.show(MESSAGES.PROFILE.ADDRESS_SAVE_FAILED, 'warning');
      },
    });
  }

  removeFav(index: number): void {
    this.favShops.splice(index, 1);
    this.toastService.show(MESSAGES.PROFILE.SHOP_REMOVED, 'info');
    this.cdr.markForCheck();
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.markForCheck();
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  doLogout(): void {
    this.closeLogoutModal();
    this.toastService.show(MESSAGES.AUTH.LOGOUT, 'info');
    this.authService.logout();
  }

  openPasswordModal(): void {
    this.passwordServerError = '';
    this.showPasswordModal = true;
    this.cdr.markForCheck();
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.passwordSubmitting = false;
    this.passwordServerError = '';
    this.cdr.markForCheck();
  }

  onPasswordSubmit(payload: ChangePasswordPayload): void {
    this.passwordSubmitting = true;
    this.passwordServerError = '';

    if (environment.useMockData) {
      setTimeout(() => {
        this.passwordSubmitting = false;
        this.closePasswordModal();
        this.toastService.show(MESSAGES.PROFILE.PASSWORD_CHANGED, 'success');
        this.cdr.markForCheck();
      }, 600);
      return;
    }

    this.profileService.changePassword(payload).subscribe({
      next: () => {
        this.passwordSubmitting = false;
        this.closePasswordModal();
        this.toastService.show(MESSAGES.PROFILE.PASSWORD_CHANGED, 'success');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.passwordSubmitting = false;
        this.passwordServerError =
          err?.error?.message || MESSAGES.PROFILE.PASSWORD_CHANGE_FAILED;
        this.cdr.markForCheck();
      },
    });
  }

  onSecurityAction(item: SecurityItem): void {
    if (item.name === 'Password') {
      this.openPasswordModal();
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    this.closeDeleteModal();
    this.toastService.show(
      MESSAGES.PROFILE.ACCOUNT_DELETE_REQUESTED,
      'warning',
    );
  }

  deactivateAccount(): void {
    this.toastService.show(MESSAGES.PROFILE.ACCOUNT_DEACTIVATED, 'warning');
  }

  clearHistory(): void {
    this.toastService.show(MESSAGES.PROFILE.ORDER_HISTORY_CLEARED, 'warning');
  }

  clearActivity(): void {
    this.activityItems = [];
    this.toastService.show(MESSAGES.PROFILE.ACTIVITY_CLEARED, 'success');
    this.cdr.markForCheck();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeLogoutModal();
      this.closeDeleteModal();
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return this.firstName ? this.firstName[0].toUpperCase() : '?';
  }

  trackById(_: number, item: { id: string | number }): string | number {
    return item.id;
  }

  trackByIdx(index: number): number {
    return index;
  }
}
