package com.smartprint.smartservice.models.Shops;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "shop_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private LkpShopService service;
}