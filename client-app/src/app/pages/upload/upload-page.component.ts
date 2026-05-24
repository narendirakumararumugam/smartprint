import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UploadStepperComponent } from './components/upload-stepper/upload-stepper.component';
import { UploadFileDropComponent } from './components/upload-file-drop/upload-file-drop.component';
import {
  FileConfigChange,
  UploadPrintConfigComponent,
} from './components/upload-print-config/upload-print-config.component';
import { UploadOrderReviewComponent } from './components/upload-order-review/upload-order-review.component';
import { UploadSuccessComponent } from './components/upload-success/upload-success.component';
import {
  ConfettiPiece,
  PRINT_ADDONS,
  PRINT_SHOPS,
  PrintShop,
  UploadedFile,
} from '../../models/upload.model';
import { ToastService } from '../../core/services/toast.service';
import { Title } from '@angular/platform-browser';
import {
  CustomerOrderService,
  OrderCreateRequest,
} from '../../core/services/customer-order.service';
import { MESSAGES } from '../../core/constants/messages';
import { estimateTotal, totalPages } from '../../utils/pricing.utils';
import { environment } from '../../environment/environment';

/** Max number of files a user can upload at once */
const MAX_FILE_COUNT = 10;
/** Max file size per file: 25 MB */
const MAX_FILE_SIZE = 25 * 1024 * 1024;

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToastContainerComponent,
    UploadStepperComponent,
    UploadFileDropComponent,
    UploadPrintConfigComponent,
    UploadOrderReviewComponent,
    UploadSuccessComponent,
  ],
  templateUrl: './upload-page.component.html',
  styleUrl: './upload-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadPageComponent implements OnInit, OnDestroy {
  readonly stepLabels = [
    'Upload Files',
    'Print Settings',
    'Review & Place Order',
  ];
  readonly addons = PRINT_ADDONS;
  readonly maxFileCount = MAX_FILE_COUNT;

  currentStep = 1;
  selectedShop: PrintShop | null = null;
  uploadedFiles: UploadedFile[] = [];
  activeFileCfg = 0;
  selectedAddons = new Set<string>();
  specialNote = '';
  orderPlaying = false; // Note: Visual overlap makes this appear as 'orderPlacing' or 'orderPlaying' depending on contextual usage below
  orderPlacing = false;
  orderPlaced = false;
  orderId = '';
  confettiPieces: ConfettiPiece[] = [];
  isLocationPickerOpen = false;

  private nextFileId = 0;
  private progressTimers: ReturnType<typeof setInterval>[] = [];

  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(CustomerOrderService);

  ngOnInit(): void {
    this.title.setTitle('Upload & Print \u2014 SmartPrint');

    this.route.queryParams.subscribe((params) => {
      const id = params['shopId'] != null ? +params['shopId'] : null;
      if (id != null && !isNaN(id)) {
        const shop = PRINT_SHOPS.find((s) => s.id === id);
        if (shop) {
          this.selectedShop = shop;
          this.toastService.show(
            MESSAGES.UPLOAD.UPLOADING(shop.name),
            'success',
          );
          this.cdr.markForCheck();
          return;
        }
      }
      // No valid shop selected ⬥ redirect back to home
      this.toastService.show(MESSAGES.UPLOAD.SELECT_SHOP, 'warning');
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy(): void {
    this.progressTimers.forEach((t) => clearInterval(t));
  }

  /* * -- COMPUTED -- * */

  get totalPrice(): number {
    return estimateTotal(this.uploadedFiles, this.selectedAddons, this.addons);
  }

  get totalPages(): number {
    return totalPages(this.uploadedFiles);
  }

  /* * -- FILES -- * */

  onFilesAdded(rawFiles: File[]): void {
    rawFiles.forEach((f) => this.handleFile(f));
  }

  handleFile(file: File): void {
    // Count restriction
    if (this.uploadedFiles.length >= MAX_FILE_COUNT) {
      this.toastService.show(
        MESSAGES.UPLOAD.MAX_FILES(MAX_FILE_COUNT),
        'warning',
      );
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'];
    if (!allowed.includes(ext)) {
      this.toastService.show(
        MESSAGES.UPLOAD.INVALID_TYPE(file.name),
        'warning',
      );
      return;
    }

    // Size restriction per file
    if (file.size > MAX_FILE_SIZE) {
      this.toastService.show(
        MESSAGES.UPLOAD.FILE_TOO_LARGE(file.name),
        'warning',
      );
      return;
    }

    const size =
      file.size > 1_048_576
        ? `${(file.size / 1_048_576).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const pages = Math.floor(Math.random() * 80 + 10);
    const color = ['jpg', 'jpeg', 'png'].includes(ext);
    const id = this.nextFileId++;

    this.uploadedFiles = [
      ...this.uploadedFiles,
      {
        id,
        name: file.name,
        size,
        pages,
        ext,
        color,
        sides: 'single',
        copies: 1,
        sizeP: 'A4',
        prog: 0,
      },
    ];
    this.toastService.show(
      MESSAGES.UPLOAD.FILE_ADDED(
        file.name,
        this.uploadedFiles.length,
        MAX_FILE_COUNT,
      ),
      'success',
    );
    this.cdr.markForCheck();

    if (isPlatformBrowser(this.platformId)) {
      let p = 0;
      const idx = this.uploadedFiles.length - 1;
      const timer = setInterval(() => {
        p += Math.random() * 18 + 8;
        if (p >= 100) {
          p = 100;
          clearInterval(timer);
        }
        this.uploadedFiles = this.uploadedFiles.map((f, i) =>
          i === idx ? { ...f, prog: Math.round(p) } : f,
        );
        this.cdr.markForCheck();
      }, 200);
      this.progressTimers.push(timer);
    } else {
      const idx = this.uploadedFiles.length - 1;
      this.uploadedFiles = this.uploadedFiles.map((f, i) =>
        i === idx ? { ...f, prog: 100 } : f,
      );
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
    if (this.activeFileCfg >= this.uploadedFiles.length) {
      this.activeFileCfg = Math.max(0, this.uploadedFiles.length - 1);
    }
    this.cdr.markForCheck();
  }

  /* * -- PRINT CONFIG -- * */

  onFileConfigChange(event: FileConfigChange): void {
    this.uploadedFiles = this.uploadedFiles.map((f, i) =>
      i === event.index ? { ...f, [event.key]: event.value } : f,
    );
    this.cdr.markForCheck();
  }

  /* * -- ADDONS -- * */

  toggleAddon(id: string): void {
    const next = new Set(this.selectedAddons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selectedAddons = next;
    this.cdr.markForCheck();
  }

  /* * -- NAVIGATION -- * */

  nextStep(): void {
    if (this.currentStep === 1 && this.uploadedFiles.length === 0) {
      this.toastService.show(MESSAGES.UPLOAD.UPLOAD_REQUIRED, 'warning');
      return;
    }
    this.currentStep++;
    this.scrollToTop();
    this.cdr.markForCheck();
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
      this.cdr.markForCheck();
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep && !this.orderPlaced) {
      this.currentStep = step;
      this.scrollToTop();
      this.cdr.markForCheck();
    }
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* * -- ORDER -- * */

  placeOrder(): void {
    this.orderPlacing = true;
    this.cdr.markForCheck();

    if (!environment.useMockData && this.selectedShop) {
      const request: OrderCreateRequest = {
        shopId: this.selectedShop.id as number,
        files: this.uploadedFiles.map((f) => ({
          fileName: f.name,
          pages: f.pages || 1,
          copies: f.copies || 1,
          color: f.color ?? false,
          sides: f.sides || 'single',
          paperSize: 'A4',
        })),
        addonIds: [...this.selectedAddons],
        specialNote: this.specialNote || undefined,
      };
      this.orderService.createOrder(request).subscribe({
        next: (res) => {
          this.orderPlaced = true;
          this.orderPlacing = false;
          this.orderId = res.orderNumber || res.id;
          if (isPlatformBrowser(this.platformId)) {
            this.fireConfetti();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          this.toastService.show(MESSAGES.ORDERS.PLACED_SUCCESS, 'success');
          this.cdr.markForCheck();
        },
        error: () => {
          this.orderPlacing = false;
          this.toastService.show(MESSAGES.ORDERS.PLACE_FAILED, 'warning');
          this.cdr.markForCheck();
        },
      });
      return;
    }

    setTimeout(() => {
      this.orderPlaced = true;
      this.orderPlacing = false;
      this.orderId = 'PH-2026-' + (Math.floor(Math.random() * 9000) + 1000);
      if (isPlatformBrowser(this.platformId)) {
        this.fireConfetti();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      this.toastService.show(MESSAGES.ORDERS.PLACED_SUCCESS, 'success');
      this.cdr.markForCheck();
    }, 1800);
  }

  private fireConfetti(): void {
    const colors = [
      '#2563eb',
      '#7c3aed',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#ef4444',
    ];
    this.confettiPieces = Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      bg: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      radius: Math.random() > 0.5 ? '50%' : '2px',
      delay: Math.random(),
      duration: Math.random() * 1.5 + 2,
    }));
    this.cdr.markForCheck();

    setTimeout(() => {
      this.confettiPieces = [];
      this.cdr.markForCheck();
    }, 4000);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
