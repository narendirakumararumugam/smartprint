import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile-modals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-modals.component.html',
  styleUrl: './profile-modals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileModalsComponent {
  @Input() showLogoutModal = false;
  @Input() showDeleteModal = false;
  @Output() closeLogout = new EventEmitter<void>();
  @Output() confirmLogout = new EventEmitter<void>();
  @Output() closeDelete = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeLogout.emit();
      this.closeDelete.emit();
    }
  }
}