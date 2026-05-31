import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminLayoutComponent, DropdownComponent],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent implements OnInit {
    private readonly title = inject(Title);

    platformName = 'SmartPrint';
    supportEmail = 'support@smartprint.in';
    maxFileSize = '100 MB';
    
    readonly fileSizeOptions: DropdownOption[] = [
        { label: '25 MB', value: '25 MB' },
        { label: '50 MB', value: '50 MB' },
        { label: '100 MB', value: '100 MB' },
        { label: '200 MB', value: '200 MB' },
    ];

    autoVerify = false;
    maintenanceMode = false;
    defaultCity = 'Delhi';
    taxRate = 0;
    orderPrefix = 'SP';

    ngOnInit(): void {
        this.title.setTitle('Platform Settings – SmartPrint Admin');
    }
}