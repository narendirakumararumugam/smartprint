import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-upload-stepper',
  standalone: true,
  imports: [],
  templateUrl: './upload-stepper.component.html',
  styleUrl: './upload-stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStepperComponent {
  @Input() steps: string[] = [];
  @Input() currentStep = 1;
  @Input() orderPlaced = false;
  @Output() stepClick = new EventEmitter<number>();
}
