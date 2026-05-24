import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Order } from '../../orders.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Input() animationDelay = 0;
  @Output() viewOrder = new EventEmitter<Order>();
  @Output() cancelClicked = new EventEmitter<Order>();
  @Output() confirmPickupClicked = new EventEmitter<Order>();
  @Output() reorderClicked = new EventEmitter<Order>();

  statusClass(status: string): string {
    const map: Record<string, string> = {
      active: 'status-active',
      ready: 'status-ready',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return map[status] ?? 'status-completed';
  }

  statusIcon(status: string): string {
    const map: Record<string, string> = {
      active: 'bx bx-loader-alt bx-spin',
      ready: 'bx bxs-check-circle',
      processing: 'bx bx-cog bx-spin',
      completed: 'bx bx-check',
      cancelled: 'bx bx-x',
    };
    return map[status] ?? 'bx bx-check';
  }

  progressColor(): string {
    return this.order.status === 'ready' ? 'var(--success)' : 'var(--primary)';
  }
}
