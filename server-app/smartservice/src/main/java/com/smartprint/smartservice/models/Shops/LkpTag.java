package com.smartprint.smartservice.models.Shops;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lkp_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LkpTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "tag_class")
    private String tagClass;
}