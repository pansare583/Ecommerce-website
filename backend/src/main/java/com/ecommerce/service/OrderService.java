package com.ecommerce.service;

import com.ecommerce.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(String paymentMethod, java.util.List<Long> cartItemIds);
    List<OrderDTO> getLoggedInUserOrders();
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrderStatus(Long orderId, String status);
}
