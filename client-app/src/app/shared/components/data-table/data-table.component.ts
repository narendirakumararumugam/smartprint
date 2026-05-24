import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn{
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            @for (col of columns; track col.key) {
              <th [style.text-align]="col.align || 'left'" [style.width]="col.width || 'auto'">{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          <ng-content></ng-content>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .data-table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; color: #94a3b8; padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0; background: #f8fafc;
    }
    .data-table :host ::ng-deep td {
      padding: 12px 14px; border-bottom: 1px solid #f1f5f9;
      font-size: 13px; color: #334155;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
}