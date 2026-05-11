import { Component, computed, Input } from '@angular/core';
import { PrintService } from '../../../core/services/print.service';
import { PrintFileConfig } from '../../../models/print/print-file-config';
import {
  PAPER_SIZE_LABELS,
  PRINT_MODE_LABELS,
  PRINT_ORIENTATION_LABELS,
  PRINT_SIDES_LABELS,
} from '../../../core/constants/print-contants';
import { PrintMode, PrintSides } from '../../../core/enums/print-enum';
import { ToggleGroupComponent } from '../../../shared/components/toggle-group/toggle-group.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-print-file-config',
  standalone: true,
  imports: [
    ToggleGroupComponent,
    DropdownComponent,
  ],
  templateUrl: './print-file-config.component.html',
  styleUrl: './print-file-config.component.css',
})
export class PrintFileConfigComponent {
  @Input() filename: string = '';
  @Input() printFileConfig!: PrintFileConfig; 
  printModeLabels = PRINT_MODE_LABELS;
  printSidesLabels = PRINT_SIDES_LABELS;
  printSizeLabels = PAPER_SIZE_LABELS;
  printOrientationLabels = PRINT_ORIENTATION_LABELS;

  printModeOptions: any = [];
  printSidesOptions: any = [];
  printSizeOptions: any = [];
  printOrientationOptions: any = [];

  printModeEnum = PrintMode;
  printSidesEnum = PrintSides;

  constructor(private _printService: PrintService) {
    this.printModeOptions = Object.entries(PRINT_MODE_LABELS).map(
      ([key, value]) => ({ value: key, label: value }),
    );
    this.printSidesOptions = Object.entries(PRINT_SIDES_LABELS).map(
      ([key, value]) => ({ value: key, label: value }),
    );
    this.printSizeOptions = Object.entries(PAPER_SIZE_LABELS).map(
      ([key, value]) => ({ value: key, label: value }),
    );
    this.printOrientationOptions = Object.entries(PRINT_ORIENTATION_LABELS).map(
      ([key, value]) => ({ value: key, label: value }),
    );
  }

  update(patch: Partial<PrintFileConfig>): void {
    this._printService.printFilesConfig.update((configs) => {
      const updatedConfigs = configs.map((config) => {
        if (config.name === this.filename) {
          return {
            ...config,
            ...patch,
          };
        }
        return config;
      });
      return updatedConfigs;
    });
  }
}
