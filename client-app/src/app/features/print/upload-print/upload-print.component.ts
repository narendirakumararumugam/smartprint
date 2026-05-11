import { Component } from '@angular/core';
import { ReviewOrderComponent } from '../review-order/review-order.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PrintSettingsComponent } from '../print-settings/print-settings.component';
import { PrintService } from '../../../core/services/print.service';
import { CommonModule } from '@angular/common';
import { PlaceOrderSuccessComponent } from '../place-order-success/place-order-success.component';

@Component({
  selector: 'app-upload-print',
  standalone: true,
  imports: [
    ReviewOrderComponent,
    UploadFilesComponent,
    PrintSettingsComponent,
    CommonModule,
    PlaceOrderSuccessComponent,
  ],
  templateUrl: './upload-print.component.html',
  styleUrl: './upload-print.component.css',
})
export class UploadPrintComponent {
  currentStep = this._printService.currentStep;
  constructor(private _printService: PrintService) {}

  goBack(): void {
    this._printService.back();
  }

  goNext(): void {
    this._printService.next();
  }

  placeOrder(): void {
    this._printService.next();
  }
}
