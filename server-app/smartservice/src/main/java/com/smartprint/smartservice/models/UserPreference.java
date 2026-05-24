package com.smartprint.smartservice.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Builder.Default
    @Column(name = "print_mode", length = 50)
    private String printMode = "Black & White";

    @Builder.Default
    @Column(length = 50)
    private String sides = "Single Sided";

    @Builder.Default
    @Column(name = "paper_size", length = 10)
    private String paperSize = "A4";

    @Builder.Default
    @Column(length = 50)
    private String binding = "None";

    @Builder.Default
    @Column(length = 20)
    private String orientation = "Portrait";

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = OffsetDateTime.now(); updatedAt = OffsetDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = OffsetDateTime.now(); }
}