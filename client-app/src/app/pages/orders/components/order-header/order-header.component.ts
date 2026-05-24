import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-header',
  standalone: true,
  imports: [],
  templateUrl: './order-header.component.html',
  styleUrl: './order-header.component.css',
})
export class OrderHeaderComponent {
  @Input() totalOrders = 0;
  @Input() activeCount = 0;
  @Input() completedCount = 0;
  @Input() totalSpent = '';
}
