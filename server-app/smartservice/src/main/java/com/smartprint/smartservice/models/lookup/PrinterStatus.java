package com.smartprint.smartservice.models.lookup;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lkp_printer_statuses")
@Getter
@Setter
@NoArgsConstructor
public class PrinterStatus extends BaseLookup{
}
