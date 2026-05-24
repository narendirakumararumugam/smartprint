package com.smartprint.smartservice.models.lookup;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lkp_user_types")
@Getter
@Setter
@NoArgsConstructor
public class UserType extends BaseLookup {
}