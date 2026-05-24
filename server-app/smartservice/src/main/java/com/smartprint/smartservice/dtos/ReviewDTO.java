package com.smartprint.smartservice.dtos;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDTO {
    private Integer id;
    private String userName;
    private String userAvatar;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}