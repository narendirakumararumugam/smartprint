package com.smartprint.smartservice.services;

import com.smartprint.smartservice.dtos.OwnerShopSettingsDTO;
import com.smartprint.smartservice.dtos.OwnerShopSettingsRequest;
import com.smartprint.smartservice.models.*;
import com.smartprint.smartservice.repository.ShopRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerShopSettingsService {

    private final ShopRepository shopRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public OwnerShopSettingsDTO getShopSettings(UUID ownerId) {
        Shop shop = findOwnerShop(ownerId);
        return toSettingsDTO(shop);
    }

    @Transactional
    public OwnerShopSettingsDTO updateShopSettings(UUID ownerId, OwnerShopSettingsRequest request) {
        Shop shop = findOwnerShop(ownerId);

        // Profile
        shop.setName(request.getShopName());
        shop.setTagline(request.getShopTagline());
        shop.setPhone(request.getShopPhone());
        shop.setCategory(request.getShopCategory());
        shop.setAbout(request.getShopDescription());
        shop.setMapsLink(request.getShopMapsLink());
        shop.setAddress(request.getShopAddress() != null ? request.getShopAddress() : shop.getAddress());
        shop.setCity(request.getShopCity() != null ? request.getShopCity() : shop.getCity());
        shop.setState(request.getShopState());
        shop.setPincode(request.getShopPincode());

        // Approval settings
        if (request.getApprovalMode() != null) {
            shop.setApprovalMode(request.getApprovalMode());
        }
        shop.setDefaultPrinter(request.getDefaultPrinter());
        if (request.getMaxOrderPages() != null) {
            shop.setMaxOrderPages(request.getMaxOrderPages());
        }
        if (request.getMaxDailyOrders() != null) {
            shop.setMaxDailyOrders(request.getMaxDailyOrders());
        }
        if (request.getMinPrepTime() != null) {
            shop.setMinPrepTime(request.getMinPrepTime());
        }
        if (request.getMaxFileSize() != null) {
            shop.setMaxFileSize(request.getMaxFileSize());
        }
        if (request.getShopOpen() != null) {
            shop.setOpen(request.getShopOpen());
        }

        // Services
        if (request.getServices() != null) {
            shop.getServices().clear();
        }

        // Paper sizes
        if (request.getPaperSizes() != null) {
            shop.getPaperSizes().clear();
        }

        // Prices
        if (request.getPriceRows() != null) {
            shop.getPrices().clear();
        }

        // Add-ons
        if (request.getAddOns() != null) {
            shop.getAddOns().clear();
        }

        // Bulk discounts
        if (request.getBulkDiscounts() != null) {
            shop.getBulkDiscounts().clear();
        }

        // Hours
        if (request.getHours() != null) {
            shop.getHours().clear();
        }

        // Closures
        if (request.getClosures() != null) {
            shop.getClosures().clear();
        }

        // Flush all pending DELETES to the DB before INSERTS.
        // This is required because shop_hours and shop_paper_sizes have unique constraints
        // on (shop_id, day_of_week) and (shop_id, size_name). Without flushing first,
        // Hibernate may attempt to INSERT new rows before the old ones are deleted, causing
        // a unique-constraint violation.
        entityManager.flush();

        // Rebuild services
        if (request.getServices() != null) {
            request.getServices().forEach(svcName -> {
                ShopServiceEntity svc = new ShopServiceEntity();
                svc.setShop(shop);
                svc.setServiceName(svcName);
                shop.getServices().add(svc);
            });
        }

        // Rebuild paper sizes
        if (request.getPaperSizes() != null) {
            request.getPaperSizes().forEach(sizeName -> {
                ShopPaperSize ps = new ShopPaperSize();
                ps.setShop(shop);
                ps.setSizeName(sizeName);
                shop.getPaperSizes().add(ps);
            });
        }

        // Rebuild prices
        if (request.getPriceRows() != null) {
            request.getPriceRows().forEach(pr -> {
                ShopPrice sp = new ShopPrice();
                sp.setShop(shop);
                sp.setService(pr.getService());
                sp.setSpec(pr.getSpec());
                sp.setPrice(pr.getPrice());
                sp.setPopular(pr.isPopular());
                shop.getPrices().add(sp);
            });
        }

        // Rebuild add-ons
        if (request.getAddOns() != null) {
            request.getAddOns().forEach(a -> {
                ShopAddon addon = new ShopAddon();
                addon.setShop(shop);
                addon.setName(a.getName());
                addon.setPrice(BigDecimal.valueOf(a.getPrice()));
                shop.getAddOns().add(addon);
            });
        }

        // Rebuild bulk discounts
        if (request.getBulkDiscounts() != null) {
            request.getBulkDiscounts().forEach(bd -> {
                ShopBulkDiscount discount = new ShopBulkDiscount();
                discount.setShop(shop);
                discount.setMinPages(bd.getMin());
                discount.setMaxPages(bd.getMax() == 0 ? null : bd.getMax());
                discount.setDiscountPercent(bd.getDiscount());
                shop.getBulkDiscounts().add(discount);
            });
        }

        // Rebuild hours
        if (request.getHours() != null) {
            request.getHours().forEach(h -> {
                ShopHour hour = new ShopHour();
                hour.setShop(shop);
                hour.setDayOfWeek(h.getDay());
                hour.setTimeRange(h.isClosed() ? "Closed" : h.getOpen() + " - " + h.getClose());
                hour.setBreakStart(h.getBreakStart());
                hour.setBreakEnd(h.getBreakEnd());
                hour.setClosed(h.isClosed());
                shop.getHours().add(hour);
            });
        }

        // Rebuild closures
        if (request.getClosures() != null) {
            request.getClosures().forEach(c -> {
                ShopClosure closure = new ShopClosure();
                closure.setShop(shop);
                closure.setClosureDate(LocalDate.parse(c.getDate()));
                closure.setReason(c.getReason());
                closure.setRecurring(c.isRecurring());
                shop.getClosures().add(closure);
            });
        }

        shopRepository.save(shop);
        return toSettingsDTO(shop);
    }

    @Transactional
    public void deleteShop(UUID ownerId) {
        Shop shop = findOwnerShop(ownerId);
        shopRepository.delete(shop);
    }

    @Transactional
    public OwnerShopSettingsDTO deactivateShop(UUID ownerId) {
        Shop shop = findOwnerShop(ownerId);
        shop.setOpen(false);
        shopRepository.save(shop);
        return toSettingsDTO(shop);
    }

    @Transactional
    public Object[] toggleShopOpen(UUID ownerId) {
        Shop shop = findOwnerShop(ownerId);
        shop.setOpen(!shop.getOpen());
        shopRepository.save(shop);
        return  new Object[]{shop.getId(), shop.getOpen(), shop.getName()};
    }

    private Shop findOwnerShop(UUID ownerId) {
        List<Shop> shops = shopRepository.findByOwnerId(ownerId);
        if (shops.isEmpty()) {
            throw new IllegalArgumentException("No shop found for this owner");
        }
        return shops.get(0);
    }

    private OwnerShopSettingsDTO toSettingsDTO(Shop shop) {
        return OwnerShopSettingsDTO.builder()
                .shopId(shop.getId())
                .shopName(shop.getName())
                .shopTagline(shop.getTagline())
                .shopPhone(shop.getPhone())
                .shopCategory(shop.getCategory())
                .shopDescription(shop.getAbout())
                .shopMapsLink(shop.getMapsLink())
                .shopAddress(shop.getAddress())
                .shopCity(shop.getCity())
                .shopState(shop.getState())
                .shopPincode(shop.getPincode())
                .services(shop.getServices().stream()
                        .map(ShopServiceEntity::getServiceName)
                        .collect(Collectors.toList()))
                .paperSizes(shop.getPaperSizes().stream()
                        .map(ShopPaperSize::getSizeName)
                        .collect(Collectors.toList()))
                .maxFileSize(shop.getMaxFileSize())
                .priceRows(shop.getPrices().stream()
                        .map(p -> OwnerShopSettingsDTO.PriceRowDTO.builder()
                                .service(p.getService())
                                .spec(p.getSpec())
                                .price(p.getPrice())
                                .popular(p.getPopular())
                                .build())
                        .collect(Collectors.toList()))
                .addOns(shop.getAddOns().stream()
                        .map(a -> OwnerShopSettingsDTO.AddonDTO.builder()
                                .name(a.getName())
                                .price(a.getPrice().doubleValue())
                                .build())
                        .collect(Collectors.toList()))
                .bulkDiscounts(shop.getBulkDiscounts().stream()
                        .map(bd -> OwnerShopSettingsDTO.BulkDiscountDTO.builder()
                                .min(bd.getMinPages())
                                .max(bd.getMaxPages() != null ? bd.getMaxPages() : 0)
                                .discount(bd.getDiscountPercent())
                                .build())
                        .collect(Collectors.toList()))
                .hours(shop.getHours().stream()
                        .map(h -> {
                            String open = "";
                            String close = "";
                            if (!h.isClosed() && h.getTimeRange() != null && h.getTimeRange().contains(" - ")) {
                                String[] parts = h.getTimeRange().split(" - ");
                                open = parts[0];
                                close = parts.length > 1 ? parts[1] : "";
                            }
                            return OwnerShopSettingsDTO.HourEntryDTO.builder()
                                    .day(h.getDayOfWeek())
                                    .open(open)
                                    .close(close)
                                    .breakStart(h.getBreakStart() != null ? h.getBreakStart() : "")
                                    .breakEnd(h.getBreakEnd() != null ? h.getBreakEnd() : "")
                                    .closed(h.isClosed())
                                    .build();
                        })
                        .collect(Collectors.toList()))
                .minPrepTime(shop.getMinPrepTime())
                .approvalMode(shop.getApprovalMode())
                .defaultPrinter(shop.getDefaultPrinter())
                .maxOrderPages(shop.getMaxOrderPages())
                .maxDailyOrders(shop.getMaxDailyOrders())
                .shopOpen(shop.getOpen())
                .closures(shop.getClosures().stream()
                        .map(c -> OwnerShopSettingsDTO.ClosureDTO.builder()
                                .date(c.getClosureDate().toString())
                                .reason(c.getReason())
                                .recurring(c.getRecurring())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}