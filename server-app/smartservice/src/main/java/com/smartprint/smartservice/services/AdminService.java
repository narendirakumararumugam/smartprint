package com.smartprint.smartservice.services;

import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.AdminOrderDTO;
import com.smartprint.smartservice.dtos.AdminShopDTO;
import com.smartprint.smartservice.dtos.AdminStatsDTO;
import com.smartprint.smartservice.dtos.AdminUserDTO;
import com.smartprint.smartservice.mappers.AdminMapper;
import com.smartprint.smartservice.models.Shop;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.repository.OrderRepository;
import com.smartprint.smartservice.repository.ShopRepository;
import com.smartprint.smartservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final OrderRepository orderRepository;
    private final AdminMapper adminMapper;

    public AdminStatsDTO getStats(){
        long totalUsers = userRepository.count();
        long totalShops = shopRepository.count();
        long totalOrders = orderRepository.count();
        long activeUsers = userRepository.countByActive(true);
        long verifiedShops = shopRepository.countByVerified(true);
        long pendingVerificationShops = shopRepository.countByVerified(false);

        return AdminStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalShops(totalShops)
                .totalOrders(totalOrders)
                .activeUsers(activeUsers)
                .verifiedShops(verifiedShops)
                .pendingVerifications(pendingVerificationShops)
                .build();
    }

    public List<AdminUserDTO> getAllUsers(){
        return userRepository.findAll().stream().map(adminMapper::toAdminUserDTOFromUserModel).collect(Collectors.toList());
    }

    public List<AdminShopDTO> getAllShops(){
        List<Shop> shops = shopRepository.findAll();
        return shops.stream().map((shop) -> {
            User user = userRepository.findById(shop.getOwnerId()).orElse(null);
            return adminMapper.toAdminShopDTOFromShopModel(shop, user);
        }).collect(Collectors.toList());
    }

    public List<AdminOrderDTO> getAllOrders(){
        return orderRepository.findAll().stream().map((order) -> {
            User user = userRepository.findById(order.getUserId()).orElse(null);
            return adminMapper.toAdminOrderDTOFromOrderModel(order, user);
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateUserStatus(UUID userId, boolean active){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException(Messages.Auth.USER_NOT_FOUND));
        user.setActive(active);
        userRepository.save(user);
    }

    @Transactional
    public void toggleShopVerification(Integer shopId, boolean verified){
        Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new RuntimeException(Messages.Orders.SHOP_NOT_FOUND));
        shop.setVerified(verified);
        shopRepository.save(shop);
    }
}
