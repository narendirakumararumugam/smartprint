import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { OwnerPrinterService } from '../../../core/services/owner-printer.service';
import { Printer, PrinterCreateRequest, PrinterStats, PrintJob } from '../../../models/printer.model';

@Component({
  selector: 'app-owner-printers',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './owner-printers.component.html',
  styleUrls: ['./owner-printers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerPrintersComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private printerService = inject(OwnerPrinterService);
  private platformId = inject(PLATFORM_ID);

  printers: Printer[] = [];
  stats: PrinterStats = { totalPrinters: 0, online: 0, printing: 0, pagesToday: 0 };
  jobs: PrintJob[] = [];

  // Modal state
  showAddModal = false;
  showRemoveModal = false;
  showDrawer = false;
  editingPrinter: Printer | null = null;
  selectedPrinter: Printer | null = null;
  removingPrinter: Printer | null = null;

  // Form fields
  form: PrinterCreateRequest = this.emptyForm();

  connType = 'USB';
  connectionTypes = ['USB', 'LAN', 'Wi-Fi', 'Cloud'];
  printerTypes = ['Laser (B&W)', 'Laser (Color)', 'Inkjet', 'Photo Printer', 'Large Format'];
  readonly printerTypeOptions: DropdownOption[] = this.printerTypes.map(t => ({ label: t, value: t }));
  
  readonly priorityOptions: DropdownOption[] = [
    { label: '1 - Highest', value: '1' },
    { label: '2 - High', value: '2' },
    { label: '3 - Normal', value: '3' },
    { label: '4 - Low', value: '4' }
  ];

  readonly defaultPrinterOptions: DropdownOption[] = [
    { label: 'No', value: 'no' },
    { label: 'Yes - use for auto-approval', value: 'yes' }
  ];

  paperSizeOptions = ['A4', 'A3', 'A5', 'Letter', 'Photo'];
  jobTypeOptions = ['B&W', 'Color', 'Photo', 'Large Format'];

  statusConfig: Record<string, { class: string; dotClass: string; label: string }> = {
    idle: { class: 'status-idle', dotClass: 'sdot-idle', label: 'Idle' },
    printing: { class: 'status-printing', dotClass: 'sdot-printing', label: 'Printing' },
    offline: { class: 'status-offline', dotClass: 'sdot-offline', label: 'Offline' },
    error: { class: 'status-error', dotClass: 'sdot-error', label: 'Error' },
    'low-ink': { class: 'status-low-ink', dotClass: 'sdot-low-ink', label: 'Low Ink' }
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  loadData(): void {
    this.printerService.getPrinters().subscribe(p => {
      this.printers = p;
      this.cdr.markForCheck();
    });

    this.printerService.getStats().subscribe(s => {
      this.stats = s;
      this.cdr.markForCheck();
    });

    this.printerService.getRecentJobs().subscribe(j => {
      this.jobs = j;
      this.cdr.markForCheck();
    });
  }

  // Modal actions
  openAddModal(): void {
    this.editingPrinter = null;
    this.form = this.emptyForm();
    this.connType = 'USB';
    this.showAddModal = true;
  }

  openEditModal(printer: Printer): void {
    this.editingPrinter = printer;
    this.form = {
      name: printer.name,
      model: printer.model,
      printerType: (printer as any).printerType || 'Laser (B&W)',
      connectionType: printer.connectionType,
      ipAddress: printer.ipAddress || '',
      port: printer.port || '9100',
      cloudService: printer.cloudService || '',
      priority: printer.priority,
      maxPagesPerJob: printer.maxPagesPerJob || 500,
      paperSizes: [...((printer as any).paperSizes || ['A4'])],
      jobTypes: [...((printer as any).jobTypes || ['B&W'])],
      isDefault: printer.isDefault
    };
    this.connType = printer.connectionType || 'USB';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  savePrinter(): void {
    if (!this.form.name) return;
    this.form.connectionType = this.connType;

    if (this.editingPrinter) {
      const req: any = { ...this.form };
      this.printerService.updatePrinter(this.editingPrinter.id, req).subscribe(() => {
        this.showAddModal = false;
        this.loadData();
      });
    } else {
      this.printerService.addPrinter(this.form as any).subscribe(() => {
        this.showAddModal = false;
        this.loadData();
      });
    }
  }

  // Remove
  openRemoveModal(printer: Printer): void {
    this.removingPrinter = printer;
    this.showRemoveModal = true;
  }

  confirmRemove(): void {
    if (!this.removingPrinter) return;
    this.printerService.deletePrinter(this.removingPrinter.id).subscribe(() => {
      this.showRemoveModal = false;
      this.removingPrinter = null;
      this.loadData();
    });
  }

  openDrawer(printer: Printer): void {
    this.selectedPrinter = printer;
    this.showDrawer = true;
  }

  closeDrawer(): void {
    this.showDrawer = false;
  }

  // Actions
  setDefault(printer: Printer): void {
    this.printerService.setDefault(printer.id).subscribe(() => this.loadData());
  }

  testPrint(printer: Printer): void {
    this.printerService.testPrint(printer.id).subscribe();
  }

  selectConn(type: string): void {
    this.connType = type;
  }

  getConnIcon(conn: string): string {
    const map: Record<string, string> = {
      LAN: 'bx-network-chart',
      USB: 'bx-usb',
      'Wi-Fi': 'bx-wifi',
      Cloud: 'bx-cloud'
    };
    return map[conn] || 'bx-plug';
  }

  getStatusInfo(status: string) {
    return this.statusConfig[status] || this.statusConfig['idle'];
  }

  private emptyForm(): PrinterCreateRequest {
    return {
      name: '',
      model: '',
      printerType: 'Laser (B&W)',
      connectionType: 'USB',
      ipAddress: '',
      port: '9100',
      cloudService: '',
      priority: 2,
      maxPagesPerJob: 500,
      paperSizes: ['A4'],
      jobTypes: ['B&W'],
      isDefault: false
    };
  }
}