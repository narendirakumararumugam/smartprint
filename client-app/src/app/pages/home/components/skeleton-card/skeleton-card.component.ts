import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCardComponent {}