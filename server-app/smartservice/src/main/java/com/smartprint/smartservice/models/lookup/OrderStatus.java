package com.smartprint.smartservice.models.lookup;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lkp_order_statuses")
@Getter
@Setter
@NoArgsConstructor
public class OrderStatus extends BaseLookup{
}