import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-personal',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
templateUrl: './profile-personal.component.html',
styleUrl: './profile-personal.component.css',
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePersonalComponent {
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() whatsapp = '';
  @Input() gender = '';
  @Input() isEditing = false;

  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();
  @Output() emailChange = new EventEmitter<string>();
  @Output() phoneChange = new EventEmitter<string>();
  @Output() whatsappChange = new EventEmitter<string>();
  @Output() genderChange = new EventEmitter<string>();
  @Output() toggleEdit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  readonly genderOptions: DropdownOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'other' },
  ];

  onGenderSelected(value: string): void {
    this.genderChange.emit(value);
  }
}
