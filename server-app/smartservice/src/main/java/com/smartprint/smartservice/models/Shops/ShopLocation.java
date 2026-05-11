package com.smartprint.smartservice.models.Shops;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private String city;

    private String pincode;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "geography(Point,4326)")
    private String location;

    @OneToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
