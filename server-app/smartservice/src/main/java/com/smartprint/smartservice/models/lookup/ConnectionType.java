package com.smartprint.smartservice.models.lookup;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lkp_connection_types")
@Getter
@Setter
@NoArgsConstructor
public class ConnectionType extends BaseLookup{
}
