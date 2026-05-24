export interface PrintJob {
  id: number;
  jobNumber: string;
  printerId: number;
  customerName: string;
  pages: number;
  printType: string;
  status: string;
  duration: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Printer {
  id: number;
  name: string;
  model: string;
  printerType: string;
  connectionType: string;
  ipAddress: string;
  port: string;
  cloudService: string;
  status: string;
  isDefault: boolean;
  priority: number;
  pagesToday: number;
  pagesTotal: number;
  jobsToday: number;
  maxPagesPerJob: number;
  paperSizes: string[];
  jobTypes: string[];
  inkLevels: PrinterInk[];
  queue: PrintJob[];
  lastSeen: string;
  createdAt: string;
}

export interface PrinterCreateRequest {
  name: string;
  model: string;
  printerType: string;
  connectionType: string;
  ipAddress?: string;
  port?: string;
  cloudService?: string;
  priority?: number;
  maxPagesPerJob?: number;
  paperSizes?: string[];
  jobTypes?: string[];
  isDefault?: boolean;
  inkLevels?: { label: string; color: string; percentage: number }[];
}

export interface PrinterUpdateRequest {
  name?: string;
  model?: string;
  printerType?: string;
  connectionType?: string;
  ipAddress?: string;
  port?: string;
  cloudService?: string;
  priority?: number;
  maxPagesPerJob?: number;
  paperSizes?: string[];
  jobTypes?: string[];
  isDefault?: boolean;
}

export interface PrinterStats {
  totalPrinters: number;
  online: number;
  printing: number;
  pagesToday: number;
}

export interface PrinterInk {
  label: string;
  color: string;
  percentage: number;
}