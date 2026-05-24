import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionType } from '../profile.component';

export interface SideNavItem {
  key: string;
  icon: string;
  label: string;
  badge?: number;
  danger?: boolean;
}

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebarComponent {
  @Input() items: SideNavItem[] = [];
  @Input() activeSection = '';
  @Output() sectionChange = new EventEmitter<SectionType>();
  @Output() logoutClicked = new EventEmitter<void>();

  onSectionClick(key: string): void {
    this.sectionChange.emit(key as SectionType);
  }

  trackByIdx(index: number): number {
    return index;
  }
}