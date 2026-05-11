import { PaperSize, PrintMode, PrintOrientation, PrintSides } from "../enums/print-enum";

export const PRINT_MODE_LABELS = {
  [PrintMode.BW]: 'Black & White',
  [PrintMode.COLOR]: 'Color'
};

export const PRINT_SIDES_LABELS = {
  [PrintSides.SINGLE]: 'Single',
  [PrintSides.DOUBLE]: 'Double'
};

export const PAPER_SIZE_LABELS = {
  [PaperSize.A4]: 'A4',
  [PaperSize.A3]: 'A3',
  [PaperSize.A5]: 'A5',
  [PaperSize.LETTER]: 'Letter'
};

export const PRINT_ORIENTATION_LABELS = {
  [PrintOrientation.PORTRAIT]: 'Portrait',
  [PrintOrientation.LANDSCAPE]: 'Landscape'
};