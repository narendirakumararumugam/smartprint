import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Shop } from '../../../../models/shop.model';

@Component({
  selector: 'app-featured-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-card.component.html', 
  styleUrl: './featured-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedCardComponent {
  @Input() shop!: Shop;
  @Output() selected = new EventEmitter<Shop>();
}