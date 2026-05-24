package com.smartprint.smartservice.models.lookup;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lkp_paper_sizes")
@Getter
@Setter
@NoArgsConstructor
public class PaperSize extends BaseLookup{
}
