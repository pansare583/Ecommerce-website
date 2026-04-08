package com.ecommerce.dto;

import com.ecommerce.entity.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private java.util.List<OrderItemDTO> items;
    private String shippingAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private String paymentMethod;
}
