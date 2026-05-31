import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environment/environment';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';

interface AuditEntry {
  id: number;
  admin: string;
  action: string;
  targetType: string;
  targetName: string;
  details: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-audit-log',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAuditLogComponent implements OnInit {
  private readonly title = inject(Title);

  entries: AuditEntry[] = [];

  ngOnInit(): void {
    this.title.setTitle('Audit Log - SmartPrint Admin');
    if (environment.useMockData) {
      this.entries = this.getMockData();
    }
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'VERIFY_SHOP': return 'bx bxs-check-circle';
      case 'REJECT_SHOP': return 'bx bx-x-circle';
      case 'DEACTIVATE_USER': return 'bx bx-user-minus';
      case 'ACTIVATE_USER': return 'bx bx-user-plus';
      case 'UPDATE_SETTINGS': return 'bx bx-cog';
      default: return 'bx bx-history';
    }
  }

  getActionColor(action: string): string {
    switch (action) {
      case 'VERIFY_SHOP':
      case 'ACTIVATE_USER': return 'icon-green';
      case 'REJECT_SHOP':
      case 'DEACTIVATE_USER': return 'icon-red';
      case 'UPDATE_SETTINGS': return 'icon-purple';
      default: return 'icon-gray';
    }
  }

  private getMockData(): AuditEntry[] {
    return [
      { id: 1, admin: 'Admin', action: 'VERIFY_SHOP', targetType: 'shop', targetName: 'QuickPrint Hub', details: 'Approved verification request', createdAt: '10 mins ago' },
      { id: 2, admin: 'Admin', action: 'DEACTIVATE_USER', targetType: 'user', targetName: 'spam_user@test.com', details: 'Spam account deactivated', createdAt: '2 hours ago' },
      { id: 3, admin: 'Admin', action: 'REJECT_SHOP', targetType: 'shop', targetName: 'Spam Shop 123', details: 'Invalid documents submitted', createdAt: '3 hours ago' },
      { id: 4, admin: 'Admin', action: 'UPDATE_SETTINGS', targetType: 'platform', targetName: 'Tax Rate', details: 'Changed from 0% to 5%', createdAt: '1 day ago' },
      { id: 5, admin: 'Admin', action: 'ACTIVATE_USER', targetType: 'user', targetName: 'rajesh@printzone.co', details: 'Account reinstated after review', createdAt: '2 days ago' },
      { id: 6, admin: 'Admin', action: 'VERIFY_SHOP', targetType: 'shop', targetName: 'EasyPrint Delhi', details: 'Documents verified', createdAt: '3 days ago' },
    ];
  }
}
