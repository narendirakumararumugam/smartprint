package com.smartprint.smartservice.models.Shops;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopTags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private LkpTag tag;
}
