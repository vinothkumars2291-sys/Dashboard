package com.halleyx.dashboard.dto;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;

@Builder
public record OrderResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String phone,
    String streetAddress,
    String city,
    String state,
    String postalCode,
    String country,
    String product,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal totalAmount,
    String status,
    String createdBy,
    Instant createdAt
) {}

