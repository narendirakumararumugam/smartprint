import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent implements OnChanges {
  @Input() show = false;
  @Input() submitting = false;
  @Input() serverError = '';

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ChangePasswordPayload>();

  private readonly cdr = inject(ChangeDetectorRef);

  current = '';
  next = '';
  confirm = '';
  errors: Record<string, string> = {};
  showCurrent = false;
  showNext = false;
  showConfirm = false;

  ngOnChanges(c: SimpleChanges): void {
    if (c['show'] && this.show) {
      this.current = '';
      this.next = '';
      this.confirm = '';
      this.errors = {};
      this.showCurrent = this.showNext = this.showConfirm = false;
    }
    if (c['serverError']) this.cdr.markForCheck();
  }

  submit(): void {
    this.errors = {};
    if (!this.current) this.errors['current'] = 'Current password is required.';
    if (!this.next) this.errors['next'] = 'New password is required.';
    else if (this.next.length < 8)
      this.errors['next'] = 'Must be at least 8 characters.';
    if (this.next && this.confirm !== this.next)
      this.errors['confirm'] = 'Passwords do not match.';

    if (Object.keys(this.errors).length) {
      this.cdr.markForCheck();
      return;
    }
    this.submitted.emit({
      currentPassword: this.current,
      newPassword: this.next,
    });
  }

  cancel(): void {
    this.closed.emit();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('cpm-overlay'))
      this.closed.emit();
  }
}
