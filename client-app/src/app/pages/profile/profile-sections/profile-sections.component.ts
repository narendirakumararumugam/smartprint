import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { ActivityItem, FavShop, SecurityItem } from '../profile.component';
import { Address } from '../../../models/address.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface PrefChangeEvent {
  key: string;
  value: string;
}

@Component({
  selector: 'app-profile-sections',
  standalone: true,
  imports: [CommonModule, DropdownComponent, FormsModule, RouterLink],
  templateUrl: './profile-sections.component.html',
  styleUrl: './profile-sections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSectionsComponent {
  @Input() activeSection = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() prefs: Record<string, string> = {};
  @Input() addresses: Address[] = [];
  @Input() securityItems: SecurityItem[] = [];
  @Input() activityItems: ActivityItem[] = [];
  @Input() favShops: FavShop[] = [];

  @Output() savePrefs = new EventEmitter<void>();
  @Output() prefChange = new EventEmitter<PrefChangeEvent>();
  @Output() addAddress = new EventEmitter<void>();
  @Output() editAddress = new EventEmitter<Address>();
  @Output() setDefaultAddress = new EventEmitter<string>();
  @Output() removeAddress = new EventEmitter<string>();
  @Output() securityAction = new EventEmitter<SecurityItem>();
  @Output() removeFav = new EventEmitter<number>();
  @Output() clearActivity = new EventEmitter<void>();
  @Output() deactivateAccount = new EventEmitter<void>();
  @Output() clearHistory = new EventEmitter<void>();
  @Output() openDeleteModal = new EventEmitter<void>();

  readonly colorOptions: DropdownOption[] = [
    { label: 'Black & White', value: 'Black & White' },
    { label: 'Color', value: 'Color' },
  ];

  readonly sidesOptions: DropdownOption[] = [
    { label: 'Single Sided', value: 'Single Sided' },
    { label: 'Double Sided', value: 'Double Sided' },
  ];

  readonly paperOptions: DropdownOption[] = [
    { label: 'A4', value: 'A4' },
    { label: 'A3', value: 'A3' },
    { label: 'Letter', value: 'Letter' },
    { label: 'Legal', value: 'Legal' },
  ];

  readonly copiesOptions: DropdownOption[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
  ];

  readonly bindingOptions: DropdownOption[] = [
    { label: 'No Binding', value: 'No Binding' },
    { label: 'Spiral Binding', value: 'Spiral Binding' },
    { label: 'Hard Binding', value: 'Hard Binding' },
    { label: 'Soft Binding', value: 'Soft Binding' },
  ];

  readonly orientationOptions: DropdownOption[] = [
    { label: 'Portrait', value: 'Portrait' },
    { label: 'Landscape', value: 'Landscape' },
  ];

  emitPref(key: string, value: string): void {
    this.prefChange.emit({ key, value });
  }

  trackByAddress(_: number, a: Address): string {
    return a.id ?? '';
  }

  trackByIdx(index: number): number {
    return index;
  }
}
