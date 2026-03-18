package com.halleyx.dashboard.controller;

import com.halleyx.dashboard.dto.OrderCreateRequest;
import com.halleyx.dashboard.dto.OrderResponse;
import com.halleyx.dashboard.dto.OrderUpdateRequest;
import com.halleyx.dashboard.service.CustomerOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

  private final CustomerOrderService service;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse create(@Valid @RequestBody OrderCreateRequest request) {
    return service.create(request);
  }

  @GetMapping
  public Page<OrderResponse> list(@PageableDefault(size = 20) Pageable pageable) {
    return service.list(pageable);
  }

  @GetMapping("/{id}")
  public OrderResponse getById(@PathVariable Long id) {
    return service.getById(id);
  }

  @PutMapping("/{id}")
  public OrderResponse update(@PathVariable Long id, @Valid @RequestBody OrderUpdateRequest request) {
    return service.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }
}

