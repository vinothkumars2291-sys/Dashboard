package com.halleyx.dashboard.service;

import com.halleyx.dashboard.dto.OrderCreateRequest;
import com.halleyx.dashboard.dto.OrderResponse;
import com.halleyx.dashboard.dto.OrderUpdateRequest;
import com.halleyx.dashboard.entity.CustomerOrder;
import com.halleyx.dashboard.exception.NotFoundException;
import com.halleyx.dashboard.repository.CustomerOrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerOrderService {

  private final CustomerOrderRepository repository;

  @Autowired
  public CustomerOrderService(CustomerOrderRepository repository) {
    this.repository = repository;
  }

  @Transactional
  public OrderResponse create(OrderCreateRequest req) {
    CustomerOrder entity = CustomerOrder.builder()
        .firstName(req.firstName())
        .lastName(req.lastName())
        .email(req.email())
        .phone(req.phone())
        .streetAddress(req.streetAddress())
        .city(req.city())
        .state(req.state())
        .postalCode(req.postalCode())
        .country(req.country())
        .product(req.product())
        .quantity(req.quantity())
        .unitPrice(scaleMoney(req.unitPrice()))
        .status(req.status())
        .createdBy(req.createdBy())
        .createdAt(Instant.now())
        .build();

    entity.setTotalAmount(calculateTotalAmount(entity.getQuantity(), entity.getUnitPrice()));
    CustomerOrder saved = repository.save(entity);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public Page<OrderResponse> list(Pageable pageable) {
    return repository.findAll(pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public OrderResponse getById(Long id) {
    return toResponse(findEntity(id));
  }

  @Transactional
  public OrderResponse update(Long id, OrderUpdateRequest req) {
    CustomerOrder entity = findEntity(id);

    entity.setFirstName(req.firstName());
    entity.setLastName(req.lastName());
    entity.setEmail(req.email());
    entity.setPhone(req.phone());
    entity.setStreetAddress(req.streetAddress());
    entity.setCity(req.city());
    entity.setState(req.state());
    entity.setPostalCode(req.postalCode());
    entity.setCountry(req.country());
    entity.setProduct(req.product());
    entity.setQuantity(req.quantity());
    entity.setUnitPrice(scaleMoney(req.unitPrice()));
    entity.setStatus(req.status());
    entity.setCreatedBy(req.createdBy());
    entity.setTotalAmount(calculateTotalAmount(entity.getQuantity(), entity.getUnitPrice()));

    return toResponse(repository.save(entity));
  }

  @Transactional
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new NotFoundException("Order not found: " + id);
    }
    repository.deleteById(id);
  }

  private CustomerOrder findEntity(Long id) {
    return repository.findById(id).orElseThrow(() -> new NotFoundException("Order not found: " + id));
  }

  private OrderResponse toResponse(CustomerOrder e) {
    return OrderResponse.builder()
        .id(e.getId())
        .firstName(e.getFirstName())
        .lastName(e.getLastName())
        .email(e.getEmail())
        .phone(e.getPhone())
        .streetAddress(e.getStreetAddress())
        .city(e.getCity())
        .state(e.getState())
        .postalCode(e.getPostalCode())
        .country(e.getCountry())
        .product(e.getProduct())
        .quantity(e.getQuantity())
        .unitPrice(e.getUnitPrice())
        .totalAmount(e.getTotalAmount())
        .status(e.getStatus())
        .createdBy(e.getCreatedBy())
        .createdAt(e.getCreatedAt())
        .build();
  }

  private BigDecimal calculateTotalAmount(Integer quantity, BigDecimal unitPrice) {
    if (quantity == null || quantity < 1) {
      throw new IllegalArgumentException("quantity must be >= 1");
    }
    if (unitPrice == null) {
      throw new IllegalArgumentException("unitPrice is required");
    }
    if (unitPrice.signum() < 0) {
      throw new IllegalArgumentException("unitPrice must be >= 0.00");
    }
    return unitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
  }

  private BigDecimal scaleMoney(BigDecimal value) {
    if (value == null) return null;
    return value.setScale(2, RoundingMode.HALF_UP);
  }
}

