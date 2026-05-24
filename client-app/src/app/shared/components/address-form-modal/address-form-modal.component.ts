import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';
import { UserLocation } from '../../../models/location.model';
import { Address } from '../../../models/address.model';
import { InlineMapPickerComponent } from '../inline-map-picker/inline-map-picker.component';

@Component({
  selector: 'app-address-form-modal',
  standalone: true,
  imports: [CommonModule, DropdownComponent, FormsModule, InlineMapPickerComponent],
  templateUrl: './address-form-modal.component.html',
  styleUrl: './address-form-modal.component.css'
})

export class AddressFormModalComponent implements OnChanges {
  @Input() show = false;
  @Input() initial: Address | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Address>();

  private readonly cdr = inject(ChangeDetectorRef);

  form: Address = this.empty();
  errors: Record<string, string> = {};

  readonly typeOptions: DropdownOption[] = [
    { label: 'Home', value: 'Home' },
    { label: 'Work', value: 'Work' },
    { label: 'College', value: 'College' },
    { label: 'Other', value: 'Other' },
  ];

  ngOnChanges(c: SimpleChanges): void {
    if (c['show'] && this.show) {
      this.form = this.initial ? { ...this.initial } : this.empty();
      this.errors = {};
      this.cdr.markForCheck();
    }
  }

  onTypeChange(v: string): void { 
    this.form.type = v; 
  }

  onLocationPicked(loc: UserLocation): void {
    this.form.latitude = loc.coordinates.lat;
    this.form.longitude = loc.coordinates.lng;
    if (!this.form.line1) this.form.line1 = loc.shortAddress;
    if (!this.form.line2) this.form.line2 = loc.fullAddress;
    if (!this.form.city && loc.city) this.form.city = loc.city;
    if (!this.form.pincode && loc.pincode) this.form.pincode = loc.pincode;
    delete this.errors['location'];
    this.cdr.markForCheck();
  }

  save(): void {
    this.errors = {};
    if (!this.form.type) this.errors['type'] = 'Required';
    if (!this.form.name?.trim()) this.errors['name'] = 'Required';
    if (!this.form.line1?.trim()) this.errors['line1'] = 'Required';
    if (!this.form.city?.trim()) this.errors['city'] = 'Required';
    if (!this.form.pincode?.trim()) this.errors['pincode'] = 'Required';
    else if (!(/^\d{6}$/.test(this.form.pincode))) this.errors['pincode'] = 'Enter a valid 6-digit PIN code.';
    if (!this.form.phone?.trim()) this.errors['phone'] = 'Required';

    if (Object.keys(this.errors).length) {
      this.cdr.markForCheck();
      return;
    }
    this.saved.emit({ ...this.form });
  }

  cancel(): void { 
    this.closed.emit(); 
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('afm-overlay')) this.closed.emit();
  }

  hasError(field: string): boolean { 
    return !!this.errors[field]; 
  }

  private empty(): Address {
    return { type: 'Home', name: '', line1: '', line2: '', city: '', pincode: '', phone: '' };
  }
}