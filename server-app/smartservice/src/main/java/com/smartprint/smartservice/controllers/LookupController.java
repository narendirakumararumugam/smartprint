package com.smartprint.smartservice.controllers;

import com.smartprint.smartservice.constants.ApiPaths;
import com.smartprint.smartservice.models.lookup.*;
import com.smartprint.smartservice.repository.lookup.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping(ApiPaths.BASE + "/public/lookups")
@RequiredArgsConstructor
public class LookupController {

    private final UserTypeRepository userTypeRepo;
    private final OrderStatusRepository orderStatusRepo;
    private final PrinterStatusRepository printerStatusRepo;
    private final PrinterTypeRepository printerTypeRepo;
    private final ConnectionTypeRepository connectionTypeRepo;
    private final PrintJobStatusRepository printJobStatusRepo;
    private final ColorModeRepository colorModeRepo;
    private final PaperSizeRepository paperSizeRepo;
    private final PrintSideRepository printSideRepo;
    private final TimelineStateRepository timelineStateRepo;
    private final ApprovalModeRepository approvalModeRepo;

    @GetMapping("/user-types")
    public List<UserType> getUserTypes() {
        return userTypeRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/order-statuses")
    public List<OrderStatus> getOrderStatuses() {
        return orderStatusRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/printer-statuses")
    public List<PrinterStatus> getPrinterStatuses() {
        return printerStatusRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/printer-types")
    public List<PrinterType> getPrinterTypes() {
        return printerTypeRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/connection-types")
    public List<ConnectionType> getConnectionTypes() {
        return connectionTypeRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/print-job-statuses")
    public List<PrintJobStatus> getPrintJobStatuses() {
        return printJobStatusRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/color-modes")
    public List<ColorMode> getColorModes() {
        return colorModeRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/paper-sizes")
    public List<PaperSize> getPaperSizes() {
        return paperSizeRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/print-sides")
    public List<PrintSide> getPrintSides() {
        return printSideRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/timeline-states")
    public List<TimelineState> getTimelineStates() {
        return timelineStateRepo.findAllByOrderBySortOrderAsc();
    }

    @GetMapping("/approval-modes")
    public List<ApprovalMode> getApprovalModes() {
        return approvalModeRepo.findAllByOrderBySortOrderAsc();
    }
}