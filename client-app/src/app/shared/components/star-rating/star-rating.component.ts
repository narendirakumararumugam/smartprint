import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsPipe } from '../../pipes/stars.pipe';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, StarsPipe],
  templateUrl: './star-rating.component.html',  
  styleUrl: './star-rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() size: 'sm' | 'lg' = 'sm';
}