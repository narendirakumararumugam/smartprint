package com.smartprint.smartservice.services;

import com.smartprint.smartservice.models.*;
import com.smartprint.smartservice.models.lookup.*;
import com.smartprint.smartservice.repository.OrderRepository;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.repository.lookup.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import com.smartprint.smartservice.constants.LookupCodes;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.*;
import com.smartprint.smartservice.repository.ShopRepository;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ShopRepository shopRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ColorModeRepository colorModeRepository;
    private final PrintSideRepository printSideRepository;
    private final PaperSizeRepository paperSizeRepository;
    private final TimelineStateRepository timelineStateRepository;
    private final UserRepository userRepository;

    private static final Map<String, BigDecimal> ADDON_PRICES = Map.of(
            "spiral", new BigDecimal("30"),
            "hard", new BigDecimal("180"),
            "lam-a4", new BigDecimal("15"),
            "lam-a3", new BigDecimal("25"),
            "scan", new BigDecimal("5"),
            "photo4x6", new BigDecimal("15")
    );

    private static final Map<String, String> ADDON_NAMES = Map.of(
            "spiral", "Spiral Binding",
            "hard", "Hard Binding",
            "lam-a4", "Lamination A4",
            "lam-a3", "Lamination A3",
            "scan", "Scanning",
            "photo4x6", "Photo Print 4x6"
    );

    @Transactional
    public OrderResponse createOrder(UUID userId, OrderCreateRequest request) {
        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.SHOP_NOT_FOUND));

        String orderNumber = generateOrderNumber();

        // Lookup entities
        OrderStatus processingStatus = orderStatusRepository.findByCode(LookupCodes.OrderStatuses.PENDING)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.ORDER_STATUS_NOT_FOUND + LookupCodes.OrderStatuses.PENDING));
        TimelineState doneState = timelineStateRepository.findByCode(LookupCodes.TimelineStates.DONE)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.TIMELINE_STATE_NOT_FOUND + LookupCodes.TimelineStates.DONE));
        TimelineState pendingState = timelineStateRepository.findByCode(LookupCodes.TimelineStates.PENDING)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.TIMELINE_STATE_NOT_FOUND + LookupCodes.TimelineStates.PENDING));

        // Calculate pricing
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderCreateRequest.OrderFileItem fileItem : request.getFiles()) {
            BigDecimal perPage = fileItem.isColor()
                    ? new BigDecimal("10")
                    : new BigDecimal("1.5");

            BigDecimal sidesFactor = "double".equals(fileItem.getSides())
                    ? new BigDecimal("0.9")
                    : BigDecimal.ONE;

            BigDecimal itemTotal = perPage
                    .multiply(BigDecimal.valueOf(fileItem.getPages()))
                    .multiply(BigDecimal.valueOf(fileItem.getCopies()))
                    .multiply(sidesFactor)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal rate = perPage.multiply(sidesFactor).setScale(2, RoundingMode.HALF_UP);

            String colorCode = fileItem.isColor() ? LookupCodes.ColorModes.COLOR : LookupCodes.ColorModes.BW;
            String sidesCode = fileItem.getSides() != null ? fileItem.getSides() : LookupCodes.PrintSides.SINGLE;
            String paperCode = fileItem.getPaperSize() != null ? fileItem.getPaperSize() : LookupCodes.PaperSizes.A4;

            ColorMode colorMode = colorModeRepository.findByCode(colorCode).orElse(null);
            PrintSide printSide = printSideRepository.findByCode(sidesCode).orElse(null);
            PaperSize paperSize = paperSizeRepository.findByCode(paperCode).orElse(null);

            OrderItem orderItem = OrderItem.builder()
                    .fileName(fileItem.getFileName())
                    .pages(fileItem.getPages())
                    .copies(fileItem.getCopies())
                    .colorMode(colorMode)
                    .sides(printSide)
                    .paperSize(paperSize)
                    .rate(rate)
                    .total(itemTotal)
                    .build();

            items.add(orderItem);
            subtotal = subtotal.add(itemTotal);
        }

        // Add addon pricing
        List<OrderAddon> addons = new ArrayList<>();
        if (request.getAddonIds() != null) {
            for (String addonId : request.getAddonIds()) {
                BigDecimal price = ADDON_PRICES.getOrDefault(addonId, BigDecimal.ZERO);
                String name = ADDON_NAMES.getOrDefault(addonId, addonId);

                OrderAddon addon = OrderAddon.builder()
                        .addonId(addonId)
                        .addonName(name)
                        .price(price)
                        .build();

                addons.add(addon);
                subtotal = subtotal.add(price);
            }
        }

        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal total = subtotal.add(tax);

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(userId)
                .shop(shop)
                .status(processingStatus)
                .subtotal(subtotal)
                .tax(tax)
                .total(total)
                .specialNote(request.getSpecialNote())
                .pickupTime("~15 min")
                .build();

        // Set order references
        items.forEach(item -> item.setOrder(order));
        order.setItems(items);

        addons.forEach(addon -> addon.setOrder(order));
        order.setAddons(addons);

        // Create initial timeline
        List<OrderTimeline> timeline = new ArrayList<>();

        timeline.add(OrderTimeline.builder()
                .order(order)
                .label("Order Placed")
                .description("Order received by shop.")
                .state(doneState)
                .eventTime(LocalDateTime.now())
                .build());

        timeline.add(OrderTimeline.builder()
                .order(order)
                .label("Printing")
                .description("Your documents are being printed.")
                .state(pendingState)
                .build());

        timeline.add(OrderTimeline.builder()
                .order(order)
                .label("Ready for Pickup")
                .description("Your order is ready to collect.")
                .state(pendingState)
                .build());

        order.setTimeline(timeline);

        orderRepository.save(order);

        return toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(UUID userId, String status) {
        List<Order> orders;
        if (status != null && !status.isBlank() && !"all".equals(status)) {
            orders = orderRepository.findByUserIdAndStatusCodeOrderByCreatedAtDesc(userId, status);
        } else {
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return orders.stream().map(this::toOrderResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.ORDER_NOT_FOUND));
        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.ORDER_NOT_FOUND));

        String currentCode = order.getStatus().getCode();
        if (!LookupCodes.OrderStatuses.PENDING.equals(currentCode) && !LookupCodes.OrderStatuses.PRINTING.equals(currentCode)) {
            throw new IllegalStateException(Messages.Orders.CANNOT_CANCEL);
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByCode(LookupCodes.OrderStatuses.CANCELLED)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.ORDER_STATUS_NOT_FOUND + LookupCodes.OrderStatuses.CANCELLED));

        order.setStatus(cancelledStatus);
        orderRepository.save(order);
        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse confirmPickup(UUID userId, UUID orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.ORDER_NOT_FOUND));

        if (!LookupCodes.OrderStatuses.READY.equals(order.getStatus().getCode())) {
            throw new IllegalStateException(Messages.Orders.NOT_READY_FOR_PICKUP);
        }

        OrderStatus completedStatus = orderStatusRepository.findByCode(LookupCodes.OrderStatuses.COMPLETED)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.ORDER_STATUS_NOT_FOUND + LookupCodes.OrderStatuses.COMPLETED));
        TimelineState doneState = timelineStateRepository.findByCode(LookupCodes.TimelineStates.DONE)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.TIMELINE_STATE_NOT_FOUND + LookupCodes.TimelineStates.DONE));

        order.setStatus(completedStatus);
        order.getTimeline().stream()
                .filter(t -> "Ready for Pickup".equals(t.getLabel()))
                .findFirst()
                .ifPresent(t -> {
                    t.setState(doneState);
                    t.setEventTime(LocalDateTime.now());
                });

        orderRepository.save(order);
        return toOrderResponse(order);
    }

    // —— Owner endpoints ——

    @Transactional(readOnly = true)
    public List<OrderResponse> getShopOrders(UUID ownerId, Integer shopId, String status) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.SHOP_NOT_FOUND));

        if (!shop.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException(Messages.Orders.NOT_AUTHORIZED_VIEW);
        }

        List<Order> orders;
        if (status != null && !status.isBlank() && !"all".equals(status)) {
            orders = orderRepository.findByShopIdAndStatusCodeOrderByCreatedAtDesc(shopId, status);
        } else {
            orders = orderRepository.findByShopIdOrderByCreatedAtDesc(shopId);
        }
        return orders.stream().map(this::toOrderResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID ownerId, UUID orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.ORDER_NOT_FOUND));

        Shop shop = order.getShop();
        if (!shop.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException(Messages.Orders.NOT_AUTHORIZED_UPDATE);
        }

        OrderStatus orderStatus = orderStatusRepository.findByCode(newStatus)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Orders.INVALID_STATUS + newStatus));
        order.setStatus(orderStatus);

        // Update timeline
        TimelineState activeState = timelineStateRepository.findByCode(LookupCodes.TimelineStates.ACTIVE).orElse(null);
        TimelineState doneState = timelineStateRepository.findByCode(LookupCodes.TimelineStates.DONE).orElse(null);

        if (LookupCodes.OrderStatuses.PRINTING.equals(newStatus)) {
            order.getTimeline().stream()
                    .filter(t -> "Printing".equals(t.getLabel()))
                    .findFirst()
                    .ifPresent(t -> {
                        t.setState(activeState);
                        t.setEventTime(LocalDateTime.now());
                    });
        } else if (LookupCodes.OrderStatuses.READY.equals(newStatus)) {
            order.getTimeline().forEach(t -> {
                if ("Printing".equals(t.getLabel())) {
                    t.setState(doneState);
                    if (t.getEventTime() == null) t.setEventTime(LocalDateTime.now());
                }
                if ("Ready for Pickup".equals(t.getLabel())) {
                    t.setState(activeState);
                    t.setEventTime(LocalDateTime.now());
                }
            });
        }

        orderRepository.save(order);
        return toOrderResponse(order);
    }

    // —— Mappers ——

    private OrderResponse toOrderResponse(Order order) {
        Shop shop = order.getShop();

        User customer = userRepository.findById(order.getUserId()).orElse(null);
        OrderResponse.CustomerSummary customerSummary = null;
        if (customer != null) {
            customerSummary = OrderResponse.CustomerSummary.builder()
                    .id(customer.getId().toString())
                    .name(customer.getFirstName() + " " + customer.getLastName())
                    .phone(customer.getPhone())
                    .avatar(customer.getAvatar())
                    .email(customer.getEmail())
                    .build();
        }

        String statusCode = order.getStatus().getCode();
        int progress = calculateProgress(statusCode);
        String progressLabel = getProgressLabel(statusCode);
        String statusLabel = getStatusLabel(statusCode);

        boolean canCancel = LookupCodes.OrderStatuses.PENDING.equals(statusCode) || LookupCodes.OrderStatuses.PRINTING.equals(statusCode);
        boolean canReorder = LookupCodes.OrderStatuses.COMPLETED.equals(statusCode) || LookupCodes.OrderStatuses.CANCELLED.equals(statusCode);

        return OrderResponse.builder()
                .id(order.getId().toString())
                .orderNumber(order.getOrderNumber())
                .status(statusCode)
                .statusLabel(statusLabel)
                .customer(customerSummary)
                .shop(OrderResponse.ShopSummary.builder()
                        .id(shop.getId())
                        .name(shop.getName())
                        .icon(shop.getIcon())
                        .gradient(shop.getGradient())
                        .address(shop.getAddress())
                        .phone(shop.getPhone())
                        .build())
                .items(order.getItems().stream().map(i -> OrderResponse.OrderItemDTO.builder()
                        .fileName(i.getFileName())
                        .pages(i.getPages())
                        .copies(i.getCopies())
                        .colorMode(i.getColorMode() != null ? i.getColorMode().getCode() : null)
                        .sides(i.getSides() != null ? i.getSides().getCode() : null)
                        .paperSize(i.getPaperSize() != null ? i.getPaperSize().getCode() : null)
                        .rate(i.getRate())
                        .total(i.getTotal())
                        .build()).collect(Collectors.toList()))
                .addons(order.getAddons().stream().map(a -> OrderResponse.OrderAddonDTO.builder()
                        .addonId(a.getAddonId())
                        .addonName(a.getAddonName())
                        .price(a.getPrice())
                        .build()).collect(Collectors.toList()))
                .timeline(order.getTimeline().stream().map(t -> OrderResponse.OrderTimelineDTO.builder()
                        .label(t.getLabel())
                        .description(t.getDescription())
                        .state(t.getState() != null ? t.getState().getCode() : null)
                        .eventTime(t.getEventTime())
                        .build()).collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .total(order.getTotal())
                .specialNote(order.getSpecialNote())
                .pickupTime(order.getPickupTime())
                .progress(progress)
                .progressLabel(progressLabel)
                .canCancel(canCancel)
                .canReorder(canReorder)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private int calculateProgress(String status) {
        if (LookupCodes.OrderStatuses.PENDING.equals(status)) return 15;
        if (LookupCodes.OrderStatuses.PRINTING.equals(status)) return 45;
        if (LookupCodes.OrderStatuses.READY.equals(status)) return 85;
        if (LookupCodes.OrderStatuses.COMPLETED.equals(status)) return 100;
        if (LookupCodes.OrderStatuses.CANCELLED.equals(status)) return 0;
        return 0;
    }

    private String getProgressLabel(String status) {
        if (LookupCodes.OrderStatuses.PENDING.equals(status)) return "Order received, waiting to start...";
        if (LookupCodes.OrderStatuses.PRINTING.equals(status)) return "Printing in progress...";
        if (LookupCodes.OrderStatuses.READY.equals(status)) return "Ready for pickup!";
        if (LookupCodes.OrderStatuses.COMPLETED.equals(status)) return "Picked up";
        if (LookupCodes.OrderStatuses.CANCELLED.equals(status)) return "Order was cancelled";
        return "";
    }

    private String getStatusLabel(String status) {
        if (LookupCodes.OrderStatuses.PENDING.equals(status)) return "Processing";
        if (LookupCodes.OrderStatuses.PRINTING.equals(status)) return "In Progress";
        if (LookupCodes.OrderStatuses.READY.equals(status)) return "Ready for Pickup";
        if (LookupCodes.OrderStatuses.COMPLETED.equals(status)) return "Completed";
        if (LookupCodes.OrderStatuses.CANCELLED.equals(status)) return "Cancelled";
        return status;
    }

    private String generateOrderNumber() {
        int year = LocalDateTime.now().getYear();
        int random = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "SP-" + year + "-" + String.format("%04d", random);
    }
}