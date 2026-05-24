import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  @Input() fullName = '';
  @Input() email = '';
  @Input() initials = '?';
  @Input() avatar = '';
  @Input() memberSince = '';
  @Input() totalOrders = 0;
  @Input() totalSpent = '';
  @Input() pagesPrinted = '';
  @Input() savedShops = 0;
  @Output() editAvatar = new EventEmitter<void>();
}