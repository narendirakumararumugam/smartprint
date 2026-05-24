import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.background]="iconBg" [style.color]="iconColor">
        <i [class]="icon"></i>
      </div>
      <div class="stat-body">
        <div class="stat-label">{{ label }}</div>
        <div class="stat-value">{{ value }}</div>
        @if (trend) {
          <div class="stat-trend" [class.up]="trendUp" [class.down]="!trendUp">
            <i [class]="trendUp ? 'bx bx-trending-up' : 'bx bx-trending-down'"></i>
            {{ trend }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      transition: 0.2s;
    }
    .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.04); transform: translateY(-1px); }
    .stat-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 19px; flex-shrink: 0;
    }
    .stat-label { font-size: 12px; color: #94a3b8; font-weight: 500; margin-bottom: 2px; }
    .stat-value { font-size: 20px; font-weight: 900; color: #0f172a; }
    .stat-trend { font-size: 11.5px; font-weight: 700; display: flex; align-items: center; gap: 3px; margin-top: 2px; }
    .stat-trend.up { color: #059669; }
    .stat-trend.down { color: #dc2626; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  @Input() icon = 'bx bx-bar-chart';
  @Input() iconBg = '#dbeafe';
  @Input() iconColor = '#2563eb';
  @Input() label = '';
  @Input() value = '';
  @Input() trend = '';
  @Input() trendUp = true;
}