package com.smartprint.smartservice.services;

import com.smartprint.smartservice.constants.LookupCodes;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.OwnerRegisterRequest;
import com.smartprint.smartservice.dtos.OwnerRegisterResponse;
import com.smartprint.smartservice.models.*;
import com.smartprint.smartservice.models.lookup.UserType;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.repository.lookup.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    @Transactional
    public OwnerRegisterResponse registerOwner(OwnerRegisterRequest request) {
        // Check if email already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            return OwnerRegisterResponse.builder()
                    .success(false)
                    .message(Messages.Owner.EMAIL_ALREADY_REGISTERED)
                    .build();
        }

        UserType ownerType = userTypeRepository.findByCode(LookupCodes.UserTypes.OWNER)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.USER_TYPE_NOT_FOUND + LookupCodes.UserTypes.OWNER));

        // Create user with owner role
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .whatsapp(request.getWhatsapp())
                .userType(ownerType)
                .active(true)
                .build();

        userRepository.save(user);

        // Create shop
        Shop shop = Shop.builder()
                .ownerId(user.getId())
                .name(request.getShopName())
                .tagline(request.getTagline())
                .address(request.getAddress())
                .city(request.getCity())
                .pincode(request.getPinCode())
                .latitude(request.getLatitude() != null ? BigDecimal.valueOf(request.getLatitude()) : null)
                .longitude(request.getLongitude() != null ? BigDecimal.valueOf(request.getLongitude()) : null)
                .phone(request.getPhone())
                .whatsapp(request.getWhatsapp())
                .email(request.getEmail())
                .open(true)
                .verified(false)
                .rating(BigDecimal.ZERO)
                .reviewCount(0)
                .icon("🏪")
                .gradient("linear-gradient(135deg, #1e3a8a, #2563eb)")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Add services
        if (request.getServices() != null) {
            List<ShopServiceEntity> services = request.getServices().stream()
                    .map(svcName -> {
                        ShopServiceEntity svc = new ShopServiceEntity();
                        svc.setShop(shop);
                        svc.setServiceName(svcName);
                        return svc;
                    })
                    .collect(Collectors.toList());
            shop.setServices(services);
        }

        // Add hours
        if (request.getHours() != null) {
            List<ShopHour> hours = request.getHours().stream()
                    .map(h -> {
                        ShopHour hour = new ShopHour();
                        hour.setShop(shop);
                        hour.setDayOfWeek(h.getDay());
                        hour.setTimeRange(h.isClosed() ? "Closed" : h.getOpen() + " - " + h.getClose());
                        hour.setClosed(h.isClosed());
                        return hour;
                    })
                    .collect(Collectors.toList());
            shop.setHours(hours);
        }

        // Add pricing as ShopPrice entries
        if (request.getPricing() != null) {
            OwnerRegisterRequest.ShopPricingDTO p = request.getPricing();
            List<ShopPrice> prices = new ArrayList<>();
            prices.add(buildPrice(shop, "B&W Print", "A4 Single Side", BigDecimal.valueOf(p.getA4BWSingle()), true));
            prices.add(buildPrice(shop, "Color Print", "A4 Single Side", BigDecimal.valueOf(p.getA4ColorSingle()), true));
            prices.add(buildPrice(shop, "B&W Print", "A4 Double Side", BigDecimal.valueOf(p.getA4BWDouble()), false));
            prices.add(buildPrice(shop, "Color Print", "A4 Double Side", BigDecimal.valueOf(p.getA4ColorDouble()), false));
            prices.add(buildPrice(shop, "B&W Print", "A3", BigDecimal.valueOf(p.getA3BW()), false));
            prices.add(buildPrice(shop, "Color Print", "A3", BigDecimal.valueOf(p.getA3Color()), false));
            prices.add(buildPrice(shop, "Photo Print", "B&W", BigDecimal.valueOf(p.getPhotoBW()), false));
            prices.add(buildPrice(shop, "Photo Print", "Color", BigDecimal.valueOf(p.getPhotoColor()), false));
            shop.setPrices(prices);
        }

        shopRepository.save(shop);

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return OwnerRegisterResponse.builder()
                .success(true)
                .shopId(shop.getId())
                .shopName(shop.getName())
                .message("Shop registered successfully! Welcome to SmartPrint Partner.")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    private ShopPrice buildPrice(Shop shop, String service, String spec, BigDecimal price, boolean isPopular) {
        ShopPrice sp = new ShopPrice();
        sp.setShop(shop);
        sp.setService(service);
        sp.setSpec(spec);
        sp.setPrice("₹" + price.stripTrailingZeros().toPlainString());
        sp.setPopular(isPopular);
        return sp;
    }
}