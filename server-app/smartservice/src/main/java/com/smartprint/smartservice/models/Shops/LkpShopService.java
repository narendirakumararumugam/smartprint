package com.smartprint.smartservice.models.Shops;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lkp_shop_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LkpShopService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}