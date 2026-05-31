package com.smartprint.smartservice.services;

import com.smartprint.smartservice.constants.LookupCodes;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.*;
import com.smartprint.smartservice.models.PrintJob;
import com.smartprint.smartservice.models.Printer;
import com.smartprint.smartservice.models.PrinterInk;
import com.smartprint.smartservice.models.lookup.ConnectionType;
import com.smartprint.smartservice.models.lookup.PrinterStatus;
import com.smartprint.smartservice.models.lookup.PrinterType;
import com.smartprint.smartservice.repository.PrintJobRepository;
import com.smartprint.smartservice.repository.PrinterRepository;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.lookup.ConnectionTypeRepository;
import com.smartprint.smartservice.repository.lookup.PrinterStatusRepository;
import com.smartprint.smartservice.repository.lookup.PrinterTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrinterService {

    private final PrinterRepository printerRepository;
    private final PrintJobRepository printJobRepository;
    private final ShopRepository shopRepository;
    private final PrinterTypeRepository printerTypeRepository;
    private final ConnectionTypeRepository connectionTypeRepository;
    private final PrinterStatusRepository printerStatusRepository;

    public List<PrinterResponse> getPrinters(Integer shopId) {
        List<Printer> printers = printerRepository.findByShopIdOrderByPriorityAsc(shopId);
        return printers.stream().map(this::toResponse).collect(Collectors.toList());
    }



    public PrinterStatsResponse getStats(Integer shopId) {
        long total = printerRepository.countByShopId(shopId);
        long online = printerRepository.countByShopIdAndStatusCodeNot(shopId, LookupCodes.PrinterStatuses.OFFLINE);
        long printing = printerRepository.countByShopIdAndStatusCode(shopId, LookupCodes.PrinterStatuses.PRINTING);
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        int pagesToday = printJobRepository.sumPagesByShopIdSince(shopId, startOfDay);

        return PrinterStatsResponse.builder()
                .totalPrinters((int) total)
                .online((int) online)
                .printing((int) printing)
                .pagesToday(pagesToday)
                .build();
    }

    @Transactional
    public PrinterResponse addPrinter(Integer shopId, PrinterCreateRequest request) {
        PrinterType pType = request.getPrinterType() != null
                ? printerTypeRepository.findByCode(request.getPrinterType()).orElse(null) : null;
        ConnectionType cType = request.getConnectionType() != null
                ? connectionTypeRepository.findByCode(request.getConnectionType()).orElse(null) : null;
        PrinterStatus idleStatus = printerStatusRepository.findByCode(LookupCodes.PrinterStatuses.IDLE)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.PRINTER_STATUS_NOT_FOUND + LookupCodes.PrinterStatuses.IDLE));

        Printer printer = Printer.builder()
                .shopId(shopId)
                .name(request.getName())
                .model(request.getModel())
                .printerType(pType)
                .connectionType(cType)
                .ipAddress(request.getIpAddress())
                .port(request.getPort())
                .cloudService(request.getCloudService())
                .priority(request.getPriority() != null ? request.getPriority() : 3)
                .maxPagesPerJob(request.getMaxPagesPerJob() != null ? request.getMaxPagesPerJob() : 500)
                .paperSizes(request.getPaperSizes() != null ? String.join(",", request.getPaperSizes()) : "A4")
                .jobTypes(request.getJobTypes() != null ? String.join(",", request.getJobTypes()) : "B&W")
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .status(idleStatus)
                .build();

        if (printer.isDefault()) {
            clearDefaults(shopId);
        }

        // Add ink levels
        if (request.getInkLevels() != null) {
            for (PrinterCreateRequest.InkLevel ink : request.getInkLevels()) {
                PrinterInk pi = PrinterInk.builder()
                        .printer(printer)
                        .label(ink.getLabel())
                        .color(ink.getColor())
                        .percentage(ink.getPercentage() != null ? ink.getPercentage() : 100)
                        .build();
                printer.getInkLevels().add(pi);
            }
        } else {
            // Default: add black ink at 100%
            printer.getInkLevels().add(PrinterInk.builder()
                    .printer(printer).label("Black").color("#1e293b").percentage(100).build());
        }

        printer = printerRepository.save(printer);
        return toResponse(printer);
    }

    @Transactional
    public PrinterResponse updatePrinter(Integer shopId, Long printerId, PrinterUpdateRequest request) {
        Printer printer = printerRepository.findById(printerId)
                .orElseThrow(() -> new RuntimeException(Messages.Printers.PRINTER_NOT_FOUND));

        if (!printer.getShopId().equals(shopId)) {
            throw new RuntimeException(Messages.Printers.NOT_BELONG_TO_SHOP);
        }

        if (request.getName() != null) printer.setName(request.getName());
        if (request.getModel() != null) printer.setModel(request.getModel());
        if (request.getPrinterType() != null) {
            printerTypeRepository.findByCode(request.getPrinterType()).ifPresent(printer::setPrinterType);
        }
        if (request.getConnectionType() != null) {
            connectionTypeRepository.findByCode(request.getConnectionType()).ifPresent(printer::setConnectionType);
        }
        if (request.getIpAddress() != null) printer.setIpAddress(request.getIpAddress());
        if (request.getPort() != null) printer.setPort(request.getPort());
        if (request.getCloudService() != null) printer.setCloudService(request.getCloudService());
        if (request.getPriority() != null) printer.setPriority(request.getPriority());
        if (request.getMaxPagesPerJob() != null) printer.setMaxPagesPerJob(request.getMaxPagesPerJob());
        if (request.getPaperSizes() != null) printer.setPaperSizes(String.join(",", request.getPaperSizes()));
        if (request.getJobTypes() != null) printer.setJobTypes(String.join(",", request.getJobTypes()));
        if (request.getIsDefault() != null) {
            if (request.getIsDefault()) clearDefaults(shopId);
            printer.setDefault(request.getIsDefault());
        }

        printer = printerRepository.save(printer);
        return toResponse(printer);
    }

    @Transactional
    public void deletePrinter(Integer shopId, Long printerId) {
        Printer printer = printerRepository.findById(printerId)
                .orElseThrow(() -> new RuntimeException(Messages.Printers.PRINTER_NOT_FOUND));

        if (!printer.getShopId().equals(shopId)) {
            throw new RuntimeException(Messages.Printers.NOT_BELONG_TO_SHOP);
        }

        printerRepository.delete(printer);
    }

    @Transactional
    public PrinterResponse setDefault(Integer shopId, Long printerId) {
        Printer printer = printerRepository.findById(printerId)
                .orElseThrow(() -> new RuntimeException(Messages.Printers.PRINTER_NOT_FOUND));

        if (!printer.getShopId().equals(shopId)) {
            throw new RuntimeException(Messages.Printers.NOT_BELONG_TO_SHOP);
        }

        clearDefaults(shopId);
        printer.setDefault(true);
        printer = printerRepository.save(printer);
        return toResponse(printer);
    }

    public List<PrintJobResponse> getRecentJobs(Integer shopId) {
        List<PrintJob> jobs = printJobRepository.findTop20ByShopIdOrderByCreatedAtDesc(shopId);
        return jobs.stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    public List<PrintJobResponse> getQueueForPrinter(Long printerId) {
        List<PrintJob> jobs = printJobRepository.findByPrinterIdAndStatusCodeOrderByCreatedAtAsc(printerId, "queued");
        return jobs.stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    private void clearDefaults(Integer shopId) {
        List<Printer> printers = printerRepository.findByShopIdOrderByPriorityAsc(shopId);
        for (Printer p : printers) {
            if (p.isDefault()) {
                p.setDefault(false);
                printerRepository.save(p);
            }
        }
    }

    private PrinterResponse toResponse(Printer p) {
        List<PrintJobResponse> queue = printJobRepository
                .findByPrinterIdAndStatusCodeOrderByCreatedAtAsc(p.getId(), "printing")
                .stream().map(this::toJobResponse).collect(Collectors.toList());

        return PrinterResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .model(p.getModel())
                .printerType(p.getPrinterType() != null ? p.getPrinterType().getCode() : null)
                .connectionType(p.getConnectionType() != null ? p.getConnectionType().getCode() : null)
                .ipAddress(p.getIpAddress())
                .port(p.getPort())
                .cloudService(p.getCloudService())
                .status(p.getStatus() != null ? p.getStatus().getCode() : null)
                .isDefault(p.isDefault())
                .priority(p.getPriority())
                .pagesToday(p.getPagesToday())
                .pagesTotal(p.getPagesTotal())
                .jobsToday(p.getJobsToday())
                .maxPagesPerJob(p.getMaxPagesPerJob())
                .paperSizes(p.getPaperSizes() != null ? Arrays.asList(p.getPaperSizes().split(",")) : List.of())
                .jobTypes(p.getJobTypes() != null ? Arrays.asList(p.getJobTypes().split(",")) : List.of())
                .inkLevels(p.getInkLevels().stream().map(i ->
                        PrinterResponse.InkLevel.builder()
                                .label(i.getLabel())
                                .color(i.getColor())
                                .percentage(i.getPercentage())
                                .build()
                ).collect(Collectors.toList()))
                .queue(queue)
                .lastSeen(p.getLastSeen())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private PrintJobResponse toJobResponse(PrintJob j) {
        return PrintJobResponse.builder()
                .id(j.getId())
                .jobNumber(j.getJobNumber())
                .printerId(j.getPrinterId())
                .customerName(j.getCustomerName())
                .pages(j.getPages())
                .printType(j.getPrintType())
                .status(j.getStatus() != null ? j.getStatus().getCode() : null)
                .duration(j.getDuration())
                .createdAt(j.getCreatedAt())
                .completedAt(j.getCompletedAt())
                .build();
    }
}