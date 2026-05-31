import { Injectable } from "@angular/core";
import { BaseApiService } from "./base-api.service";
import { API_ENDPOINTS, RESOURCE_PATHS } from "../constants/api-endpoints";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Printer, PrinterCreateRequest, PrinterStats, PrinterUpdateRequest, PrintJob } from "../../models/printer.model";

@Injectable({ providedIn: 'root' })
export class OwnerPrinterService extends BaseApiService {
  protected readonly resourcePath = RESOURCE_PATHS.PRINTERS;

  constructor(http: HttpClient) {
    super(http);
  }

  getPrinters(): Observable<Printer[]> {
    return this.apiGet<Printer[]>(API_ENDPOINTS.PRINTERS.LIST, []);
  }

  getStats(): Observable<PrinterStats> {
    return this.apiGet<PrinterStats>(API_ENDPOINTS.PRINTERS.STATS, { totalPrinters: 0, online: 0, printing: 0, pagesToday: 0 });
  }

  addPrinter(request: PrinterCreateRequest): Observable<Printer> {
    return this.apiPost<Printer>(API_ENDPOINTS.PRINTERS.CREATE, request, {} as Printer);
  }

  updatePrinter(id: number, request: PrinterUpdateRequest): Observable<Printer> {
    return this.apiPut<Printer>(API_ENDPOINTS.PRINTERS.UPDATE(id), request, {} as Printer);
  }

  deletePrinter(id: number): Observable<{ success: boolean }> {
    return this.apiDelete<{ success: boolean }>(API_ENDPOINTS.PRINTERS.DELETE(id), { success: true });
  }

  setDefault(id: number): Observable<Printer> {
    return this.apiPost<Printer>(API_ENDPOINTS.PRINTERS.SET_DEFAULT(id), {}, {} as Printer);
  }

  testPrint(id: number): Observable<{ status: string; message: string }> {
    return this.apiPost<{ status: string; message: string }>(API_ENDPOINTS.PRINTERS.TEST_PRINT(id), {}, { status: 'success', message: 'Print test completed successfully.' });
  }

  getRecentJobs(): Observable<PrintJob[]> {
    return this.apiGet<PrintJob[]>(API_ENDPOINTS.PRINTERS.JOBS, []);
  }

  getPrinterQueue(id: number): Observable<PrintJob[]> {
    return this.apiGet<PrintJob[]>(API_ENDPOINTS.PRINTERS.QUEUE(id), []);
  }
}