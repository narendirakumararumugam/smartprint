import { BindingType, PaperSize, PrintMode, PrintOrientation, PrintSides } from "../../core/enums/print-enum";

export interface PrintFileConfig {
  name: string;
  printMode: PrintMode;
  paperSize: PaperSize;
  sides: PrintSides;
  binding: BindingType;
  pageRange: string;
  size: string;
  noOfCopies: number;
  orientation: PrintOrientation;
}
