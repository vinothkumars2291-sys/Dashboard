package com.halleyx.dashboard.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record OrderCreateRequest(
    @NotBlank @Size(max = 100) String firstName,
    @NotBlank @Size(max = 100) String lastName,
    @NotBlank @Email @Size(max = 255) String email,
    @NotBlank @Size(max = 50) String phone,
    @NotBlank @Size(max = 255) String streetAddress,
    @NotBlank @Size(max = 100) String city,
    @NotBlank @Size(max = 100) String state,
    @NotBlank @Size(max = 30) String postalCode,
    @NotBlank @Size(max = 100) String country,
    @NotBlank @Size(max = 150) String product,
    @NotNull @Min(1) Integer quantity,
    @NotNull @DecimalMin(value = "0.00", inclusive = true) BigDecimal unitPrice,
    @NotBlank @Size(max = 50) String status,
    @NotBlank @Size(max = 100) String createdBy
) {}

