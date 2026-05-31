import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PrintShop } from '../../../../models/upload.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './upload-success.component.html',
  styleUrl: './upload-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadSuccessComponent {
  @Input() orderId = '';
  @Input() shop: PrintShop | null = null;

}
