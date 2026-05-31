import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownComponent, DropdownOption } from '../../../shared/components/dropdown/dropdown.component';
import { OwnerTopbarService } from '../../../core/services/owner-topbar.service';
import { OwnerShopService, ShopSettingsResponse } from '../../../core/services/owner-shop.service';
import { environment } from '../../../environment/environment';

interface ServiceChip {
  name: string;
  icon: string;
  enabled: boolean;
}

interface PriceRow {
  type: string;
  bwSingle: number;
  bwDouble: number;
  colorSingle: number;
  colorDouble: number;
}

interface HourEntry {
  day: string;
  open: string;
  close: string;
  breakStart: string;
  breakEnd: string;
  closed: boolean;
}

interface ScheduledClosure {
  date: string;
  reason: string;
  recurring: boolean;
}

const ALL_SERVICES: ServiceChip[] = [
  { name: 'B&W Printing', icon: 'bx bx-file', enabled: false },
  { name: 'Color Printing', icon: 'bx bx-palette', enabled: false },
  { name: 'Spiral Binding', icon: 'bx bx-book-open', enabled: false },
  { name: 'Hard Binding', icon: 'bx bx-book', enabled: false },
  { name: 'Lamination', icon: 'bx bx-layer', enabled: false },
  { name: 'Scanning', icon: 'bx bx-scan', enabled: false },
  { name: 'Passport Photo', icon: 'bx bx-camera', enabled: false },
  { name: 'ID Card Print', icon: 'bx bx-address-book', enabled: false },
  { name: 'Banner Print', icon: 'bx bx-image', enabled: false },
  { name: 'Thesis Print', icon: 'bx bx-book-reader', enabled: false },
];

const DEFAULT_HOURS: HourEntry[] = [
  { day: 'Monday', open: '09:00', close: '20:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Tuesday', open: '09:00', close: '20:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Wednesday', open: '09:00', close: '20:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Thursday', open: '09:00', close: '20:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Friday', open: '09:00', close: '21:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Saturday', open: '09:00', close: '21:00', breakStart: '', breakEnd: '', closed: false },
  { day: 'Sunday', open: '10:00', close: '16:00', breakStart: '', breakEnd: '', closed: true },
];

@Component({
  selector: 'app-owner-shop-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './owner-shop-settings.component.html',
  styleUrl: './owner-shop-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShopSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly topbar = inject(OwnerTopbarService);
  private readonly ownerShopService = inject(OwnerShopService);
  private readonly router = inject(Router);

  @ViewChild('topbarActions') topbarActions?: TemplateRef<unknown>;

  activeTab = 'profile';
  isDirty = false;
  showDangerModal = false;
  dangerAction: 'delete' | 'deactivate' = 'delete';
  dangerInput = '';
  showAddClosure = false;

  tabs = [
    { id: 'profile', label: 'Profile', icon: 'bx bx-store' },
    { id: 'services', label: 'Services', icon: 'bx bx-checklist' },
    { id: 'pricing', label: 'Pricing', icon: 'bx bx-purchase-tag' },
    { id: 'hours', label: 'Hours', icon: 'bx bx-time' },
    { id: 'approval', label: 'Approval', icon: 'bx bxs-shield' },
    { id: 'closure', label: 'Closure', icon: 'bx bx-sun' },
    { id: 'danger', label: 'Danger', icon: 'bx bx-error' },
  ];

  // Profile
  shopName = '';
  shopTagline = '';
  shopPhone = '';
  shopCategory = 'print-shop';
  readonly categoryOptions: DropdownOption[] = [
    { label: 'Print Shop', value: 'print-shop' },
    { label: 'Cyber Café', value: 'cyber-cafe' },
    { label: 'Stationery Store', value: 'stationery' },
  ];
  shopDescription = '';
  shopMapsLink = '';
  shopAddress = '';
  shopCity = '';
  shopState = '';
  shopPincode = '';

  // Services
  services: ServiceChip[] = ALL_SERVICES.map(s => ({ ...s }));
  paperSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal'];
  selectedPaperSizes: string[] = ['A4'];
  maxFileSize = '50 MB';
  readonly fileSizeOptions: DropdownOption[] = [
    { label: '10 MB', value: '10 MB' },
    { label: '25 MB', value: '25 MB' },
    { label: '50 MB', value: '50 MB' },
    { label: '100 MB', value: '100 MB' },
  ];

  // Pricing
  priceRows: PriceRow[] = [
    { type: 'A4', bwSingle: 0, bwDouble: 0, colorSingle: 0, colorDouble: 0 },
  ];
  addOns: { name: string; price: number }[] = [];
  bulkDiscounts: { min: number; max: number; discount: number }[] = [];

  // Hours
  hours: HourEntry[] = DEFAULT_HOURS.map(h => ({ ...h }));
  minPrepTime = 15;

  // Approval
  approvalMode: 'auto' | 'manual' = 'manual';
  defaultPrinter = '';
  readonly printerOptions: DropdownOption[] = [
    { label: 'HP LaserJet M401n', value: 'HP LaserJet M401n' },
    { label: 'Canon iR2625', value: 'Canon iR2625' },
    { label: 'Epson L3252', value: 'Epson L3252' },
  ];
  maxOrderPages = 500;
  maxDailyOrders = 50;

  // Closure
  shopOpen = true;
  closures: ScheduledClosure[] = [];
  newClosureDate = '';
  newClosureReason = '';
  newClosureRecurring = false;

  ngOnInit(): void {
    this.loadFromBackend();
    this.topbar.setShopOpen(this.shopOpen);
  }

  ngAfterViewInit(): void {
    if (this.topbarActions) {
      this.topbar.setActions(this.topbarActions);
    }
  }

  ngOnDestroy(): void {
    this.topbar.clearActions();
  }

  switchTab(tabId: string): void {
    this.activeTab = tabId;
    this.cdr.markForCheck();
  }

  markDirty(): void {
    this.isDirty = true;
    this.cdr.markForCheck();
  }

  saveSettings(): void {
    const payload = this.buildSavePayload();
    this.ownerShopService.updateSettings(payload).subscribe({
      next: (data) => {
        this.populateFromResponse(data);
        this.isDirty = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Mock mode: just clear dirty flag without backend persistence
        if (environment.useMockData) {
          this.isDirty = false;
        }
        this.cdr.markForCheck();
      },
    });
  }

  discardChanges(): void {
    this.isDirty = false;
    this.loadFromBackend();
    this.cdr.markForCheck();
  }

  private loadFromBackend(): void {
    this.ownerShopService.getSettings().subscribe({
      next: (data) => this.populateFromResponse(data),
      error: () => {
        // Backend unavailable - fall back to mock data for a usable UI
        if (environment.useMockData) {
          this.loadMockData();
        }
        this.cdr.markForCheck();
      },
    });
  }

  private populateFromResponse(data: ShopSettingsResponse): void {
    this.shopName = data.shopName || '';
    this.shopTagline = data.shopTagline || '';
    this.shopPhone = data.shopPhone || '';
    this.shopCategory = data.shopCategory || 'print-shop';
    this.shopDescription = data.shopDescription || '';
    this.shopMapsLink = data.shopMapsLink || '';
    this.shopAddress = data.shopAddress || '';
    this.shopCity = data.shopCity || '';
    this.shopState = data.shopState || '';
    this.shopPincode = data.shopPincode || '';

    if (data.services) {
      const enabledSet = new Set(data.services);
      this.services = ALL_SERVICES.map(s => ({ ...s, enabled: enabledSet.has(s.name) }));
    }

    if (data.paperSizes) {
      this.selectedPaperSizes = [...data.paperSizes];
    }

    if (data.maxFileSize) {
      this.maxFileSize = data.maxFileSize;
    }

    if (data.priceRows && data.priceRows.length > 0) {
      // Map backend price rows to frontend format grouped by spec
      const grouped = new Map<string, PriceRow>();
      data.priceRows.forEach(pr => {
        const key = (pr.spec || '').replace(/\s*single\s*side/i,'').replace(/\s*double\s*side/i,'').trim() || pr.service;
        if (!grouped.has(key)) {
          grouped.set(key, { type: key, bwSingle: 0, bwDouble: 0, colorSingle: 0, colorDouble: 0 });
        }
        // price is stored as "₹2" format - extract number
        const numPrice = parseFloat(pr.price.replace(/[₹,\s]/g, '')) || 0;
        const row = grouped.get(key)!;
        
        const svcLower = pr.service.toLowerCase();
        const specLower = (pr.spec || '').toLowerCase();
        const isBW = svcLower.includes('b&w') || svcLower.includes('black');
        const isColor = svcLower.includes('color') || svcLower.includes('colour');
        const isDouble = specLower.includes('double');

        if (isBW && isDouble) row.bwDouble = numPrice;
        else if (isBW) row.bwSingle = numPrice;
        else if (isColor && isDouble) row.colorDouble = numPrice;
        else if (isColor) row.colorSingle = numPrice;
      });

      if (grouped.size > 0) {
        this.priceRows = Array.from(grouped.values());
      }
    }

    if (data.addOns) {
      this.addOns = data.addOns.map(a => ({ name: a.name, price: a.price }));
    }

    if (data.bulkDiscounts) {
      this.bulkDiscounts = data.bulkDiscounts.map(bd => ({ min: bd.min, max: bd.max, discount: bd.discount }));
    }

    if (data.hours && data.hours.length > 0) {
      // Merge backend data with default 7-day structure - ensures all days always present
      this.hours = DEFAULT_HOURS.map(def => {
        const found = data.hours.find(h => h.day === def.day);
        return found 
          ? { 
              day: found.day, 
              open: found.open || '09:00', 
              close: found.close || '18:00', 
              breakStart: found.breakStart || '', 
              breakEnd: found.breakEnd || '', 
              closed: found.closed 
            }
          : { ...def };
      });
    }

    if (data.minPrepTime !== null) this.minPrepTime = data.minPrepTime;
    if (data.approvalMode) this.approvalMode = data.approvalMode as 'auto' | 'manual';
    if (data.defaultPrinter) this.defaultPrinter = data.defaultPrinter;
    if (data.maxOrderPages !== null) this.maxOrderPages = data.maxOrderPages;
    if (data.maxDailyOrders !== null) this.maxDailyOrders = data.maxDailyOrders;
    this.shopOpen = data.shopOpen;

    if (data.closures) {
      this.closures = data.closures.map(c => ({ date: c.date, reason: c.reason, recurring: c.recurring }));
    }

    this.topbar.setShopOpen(this.shopOpen);
    this.cdr.markForCheck();
  }

  private loadMockData(): void {
    this.shopName = 'QuickPrint Express';
    this.shopTagline = 'Fast, affordable printing near campus';
    this.shopPhone = '+91 98765 43210';
    this.shopDescription = 'We offer premium printing services for students and professionals. Located right next to the main campus gate.';
    this.shopMapsLink = 'https://maps.google.com/?q=QuickPrint+Express';
    this.shopAddress = '42, College Road, Near Main Gate';
    this.shopCity = 'Bangalore';
    this.shopState = 'Karnataka';
    this.shopPincode = '560001';
    
    this.services = [
      { name: 'B&W Printing', icon: 'bx bx-file', enabled: true },
      { name: 'Color Printing', icon: 'bx bx-palette', enabled: true },
      { name: 'Spiral Binding', icon: 'bx bx-book-open', enabled: true },
      { name: 'Hard Binding', icon: 'bx bx-book', enabled: true },
      { name: 'Lamination', icon: 'bx bx-layer', enabled: true },
      { name: 'Scanning', icon: 'bx bx-scan', enabled: false },
      { name: 'Passport Photo', icon: 'bx bx-camera', enabled: false },
      { name: 'ID Card Print', icon: 'bx bx-address-book', enabled: false },
      { name: 'Banner Print', icon: 'bx bx-image', enabled: false },
      { name: 'Thesis Print', icon: 'bx bx-book-reader', enabled: true },
    ];

    this.selectedPaperSizes = ['A4', 'A3', 'Letter'];
    
    this.priceRows = [
      { type: 'A4', bwSingle: 2, bwDouble: 1.5, colorSingle: 8, colorDouble: 7 },
      { type: 'A3', bwSingle: 5, bwDouble: 4, colorSingle: 15, colorDouble: 13 },
      { type: 'Legal', bwSingle: 3, bwDouble: 2.5, colorSingle: 10, colorDouble: 9 },
    ];

    this.addOns = [
      { name: 'Spiral Binding', price: 30 },
      { name: 'Hard Binding', price: 80 },
      { name: 'Lamination (per page)', price: 5 },
      { name: 'Cover Page (Color)', price: 10 },
    ];

    this.bulkDiscounts = [
      { min: 100, max: 499, discount: 5 },
      { min: 500, max: 999, discount: 10 },
      { min: 1000, max: 0, discount: 15 },
    ];

    this.hours = [
      { day: 'Monday', open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00', closed: false },
      { day: 'Tuesday', open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00', closed: false },
      { day: 'Wednesday', open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00', closed: false },
      { day: 'Thursday', open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00', closed: false },
      { day: 'Friday', open: '09:00', close: '21:00', breakStart: '', breakEnd: '', closed: false },
      { day: 'Saturday', open: '09:00', close: '21:00', breakStart: '', breakEnd: '', closed: false },
      { day: 'Sunday', open: '10:00', close: '16:00', breakStart: '', breakEnd: '', closed: true },
    ];

    this.approvalMode = 'auto';
    this.defaultPrinter = 'HP LaserJet M401n';

    this.closures = [
      { date: '2026-01-26', reason: 'Republic Day', recurring: true },
      { date: '2026-03-14', reason: 'Holi', recurring: true },
      { date: '2026-08-15', reason: 'Independence Day', recurring: true },
    ];
  }

  private buildSavePayload(): any {
    return {
      shopName: this.shopName,
      shopTagline: this.shopTagline,
      shopPhone: this.shopPhone,
      shopCategory: this.shopCategory,
      shopDescription: this.shopDescription,
      shopMapsLink: this.shopMapsLink,
      shopAddress: this.shopAddress,
      shopCity: this.shopCity,
      shopState: this.shopState,
      shopPincode: this.shopPincode,
      services: this.services.filter(s => s.enabled).map(s => s.name),
      paperSizes: this.selectedPaperSizes,
      maxFileSize: this.maxFileSize,
      priceRows: this.priceRows.flatMap(row => [
        { service: 'B&W Print', spec: row.type + ' Single Side', price: '₹' + row.bwSingle, popular: false },
        { service: 'B&W Print', spec: row.type + ' Double Side', price: '₹' + row.bwDouble, popular: false },
        { service: 'Color Print', spec: row.type + ' Single Side', price: '₹' + row.colorSingle, popular: false },
        { service: 'Color Print', spec: row.type + ' Double Side', price: '₹' + row.colorDouble, popular: false }
      ]),
      addOns: this.addOns.map(a => ({ name: a.name, price: a.price })),
      bulkDiscounts: this.bulkDiscounts.map(bd => ({ min: bd.min, max: bd.max, discount: bd.discount })),
      hours: this.hours.map(h => ({
        day: h.day,
        open: h.open,
        close: h.close,
        breakStart: h.breakStart,
        breakEnd: h.breakEnd,
        closed: h.closed,
      })),
      minPrepTime: this.minPrepTime,
      approvalMode: this.approvalMode,
      defaultPrinter: this.defaultPrinter,
      maxOrderPages: this.maxOrderPages,
      maxDailyOrders: this.maxDailyOrders,
      shopOpen: this.shopOpen,
      closures: this.closures.map(c => ({ date: c.date, reason: c.reason, recurring: c.recurring }))
    };
  }

  toggleService(service: ServiceChip): void {
    service.enabled = !service.enabled;
    this.markDirty();
  }

  togglePaperSize(size: string): void {
    const idx = this.selectedPaperSizes.indexOf(size);
    if (idx > -1) {
      this.selectedPaperSizes = this.selectedPaperSizes.filter((_, i) => i !== idx);
    } else {
      this.selectedPaperSizes = [...this.selectedPaperSizes, size];
    }
    this.markDirty();
  }

  addPriceRow(): void {
    this.priceRows = [...this.priceRows, { type: 'A4', bwSingle: 0, bwDouble: 0, colorSingle: 0, colorDouble: 0 }];
    this.markDirty();
  }

  removePriceRow(index: number): void {
    this.priceRows = this.priceRows.filter((_, i) => i !== index);
    this.markDirty();
  }

  addAddon(): void {
    this.addOns = [...this.addOns, { name: '', price: 0 }];
    this.markDirty();
  }

  removeAddon(index: number): void {
    this.addOns = this.addOns.filter((_, i) => i !== index);
    this.markDirty();
  }

  addBulkDiscount(): void {
    this.bulkDiscounts = [...this.bulkDiscounts, { min: 0, max: 0, discount: 0 }];
    this.markDirty();
  }

  removeBulkDiscount(index: number): void {
    this.bulkDiscounts = this.bulkDiscounts.filter((_, i) => i !== index);
    this.markDirty();
  }

  isPaperSelected(size: string): boolean {
    return this.selectedPaperSizes.includes(size);
  }

  toggleDayClosed(entry: HourEntry): void {
    entry.closed = !entry.closed;
    this.markDirty();
  }

  copyMondayToAll(): void {
    const monday = this.hours[0];
    this.hours.forEach((h, i) => {
      if (i === 0 || h.closed) return;
      h.open = monday.open;
      h.close = monday.close;
    });
    this.markDirty();
  }

  setApprovalMode(mode: 'auto' | 'manual'): void {
    this.approvalMode = mode;
    this.markDirty();
  }

  toggleShopClosure(): void {
    this.shopOpen = !this.shopOpen;
    this.topbar.setShopOpen(this.shopOpen);
    this.markDirty();
  }

  toggleAddClosure(): void {
    this.showAddClosure = !this.showAddClosure;
    this.cdr.markForCheck();
  }

  addClosure(): void {
    if (!this.newClosureDate || !this.newClosureReason.trim()) return;
    this.closures = [...this.closures, {
      date: this.newClosureDate,
      reason: this.newClosureReason.trim(),
      recurring: this.newClosureRecurring,
    }].sort((a, b) => a.date.localeCompare(b.date));
    
    this.newClosureDate = '';
    this.newClosureReason = '';
    this.newClosureRecurring = false;
    this.showAddClosure = false;
    this.markDirty();
  }

  removeClosure(index: number): void {
    this.closures = this.closures.filter((_, i) => i !== index);
    this.markDirty();
  }

  formatDate(dateStr: string): string {
    if (!isPlatformBrowser(this.platformId)) return dateStr;
    const dt = new Date(dateStr + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  openDangerModal(action: 'delete' | 'deactivate'): void {
    this.dangerAction = action;
    this.dangerInput = '';
    this.showDangerModal = true;
    this.cdr.markForCheck();
  }

  closeDangerModal(): void {
    this.showDangerModal = false;
    this.cdr.markForCheck();
  }

  confirmDanger(): void {
    if (this.dangerAction === 'delete' && this.dangerInput !== this.shopName) return;
    if (this.dangerAction === 'deactivate' && this.dangerInput !== 'DEACTIVATE') return;

    this.closeDangerModal();

    if (this.dangerAction === 'delete') {
      this.ownerShopService.deleteShop().subscribe({
        next: () => {
          // Shop deleted - send owner to the registration/create-shop page
          this.topbar.clearActions();
          this.router.navigate(['/owner/register']);
        },
        error: () => this.cdr.markForCheck(),
      });
    } else {
      this.ownerShopService.deactivateShop().subscribe({
        next: (data) => {
          this.populateFromResponse(data);
          this.cdr.markForCheck();
        },
        error: () => this.cdr.markForCheck(),
      });
    }
  }

  get dangerTitle(): string {
    return this.dangerAction === 'delete' ? 'Delete Shop' : 'Deactivate Shop';
  }

  get dangerText(): string {
    return this.dangerAction === 'delete'
      ? 'This action is permanent and cannot be undone. All your shop data, orders, and settings will be deleted forever.'
      : 'Your shop listing will be hidden from customers. You can reactivate anytime.';
  }

  get dangerPlaceholder(): string {
    return this.dangerAction === 'delete'
      ? `Type "${this.shopName}" to confirm`
      : 'Type "DEACTIVATE" to confirm';
  }
}