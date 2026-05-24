import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AvatarOption {
  emoji: string;
  bg: string;
}

export const DEFAULT_AVATARS: AvatarOption[] = [
  { emoji: '👨', bg: '#e0e7ff' },
  { emoji: '👩', bg: '#fce7f3' },
  { emoji: '🧑', bg: '#d1fae5' },
  { emoji: '👨‍🦱', bg: '#fef3c7' },
  { emoji: '👩‍🦰', bg: '#ede9fe' },
  { emoji: '👨‍🦳', bg: '#cffafe' },
  { emoji: '🐱', bg: '#ffedd5' },
  { emoji: '🦁', bg: '#f3e8ff' },
  { emoji: '🤖', bg: '#f1f5f9' },
  { emoji: '🦊', bg: '#fff7ed' },
  { emoji: '🐻', bg: '#fef3c7' },
  { emoji: '🐷', bg: '#fde68a' },
];

@Component({
  selector: 'app-avatar-picker-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-picker-modal.component.html',
  styleUrl: './avatar-picker-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPickerModalComponent {
  @Input() show = false;
  @Input() currentAvatar = '';
  @Input() avatars: AvatarOption[] = DEFAULT_AVATARS;

  @Output() closed = new EventEmitter<void>();
  @Output() avatarSelected = new EventEmitter<string>();

  picked = '';

  ngOnChanges(): void {
    this.picked = this.currentAvatar;
  }

  pick(emoji: string): void {
    this.picked = emoji;
  }

  save(): void {
    if (this.picked) this.avatarSelected.emit(this.picked);
    this.closed.emit();
  }

  onBackdropClick(e: MouseEvent): void{
    if((e.target as HTMLElement).classList.contains('apm-overlay')) this.closed.emit();
  }
}