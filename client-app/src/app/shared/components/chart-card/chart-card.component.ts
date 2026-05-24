import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card">
      <div class="chart-header">
        <div>
          <div class="chart-title">{{ title }}</div>
          @if (subtitle) {
            <div class="chart-subtitle">{{ subtitle }}</div>
          }
        </div>
        <ng-content select="[chart-actions]"></ng-content>
      </div>
      <div class="chart-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
    }
    .chart-header {
      padding: 18px 20px 0;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .chart-title { font-size: 15px; font-weight: 800; color: #0f172a; }
    .chart-subtitle { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .chart-body { padding: 16px 20px 20px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}