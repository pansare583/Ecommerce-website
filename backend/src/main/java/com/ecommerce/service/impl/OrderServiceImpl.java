package com.ecommerce.service.impl;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.OrderDTO;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.ecommerce.repository.ProductRepository productRepository;

    @Autowired
    private OrderMapper orderMapper;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with principal: " + username));
    }

    @Autowired
    private com.ecommerce.service.EmailService emailService;

    @Override
    @Transactional
    public OrderDTO createOrder(String paymentMethod, java.util.List<Long> cartItemIds) {
        User user = getAuthenticatedUser();
        CartDTO cart = cartService.getLoggedInUserCart();

        List<com.ecommerce.dto.CartItemDTO> selectedItems = cart.getItems();
        if (cartItemIds != null && !cartItemIds.isEmpty()) {
            selectedItems = cart.getItems().stream()
                    .filter(item -> cartItemIds.contains(item.getId()))
                    .collect(Collectors.toList());
        }

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Cannot create order from empty selection");
        }

        java.math.BigDecimal total = selectedItems.stream()
                .map(item -> item.getPrice().multiply(new java.math.BigDecimal(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(paymentMethod.equalsIgnoreCase("COD") ? OrderStatus.PENDING : OrderStatus.PAID)
                .createdAt(LocalDateTime.now())
                .shippingAddress(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .phoneNumber(user.getPhoneNumber())
                .paymentMethod(paymentMethod)
                .build();

        List<com.ecommerce.entity.OrderItem> orderItems = selectedItems.stream().map(cartItem -> {
            com.ecommerce.entity.Product p = productRepository.findById(cartItem.getProductId()).orElseThrow();
            return com.ecommerce.entity.OrderItem.builder()
                    .order(order)
                    .product(p)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        
        // Remove only selected items from cart
        for (com.ecommerce.dto.CartItemDTO item : selectedItems) {
            cartService.removeItemFromCart(item.getId());
        }
        
        try {
            emailService.sendOrderConfirmation(user.getEmail(), orderMapper.toDto(savedOrder));
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
        
        return orderMapper.toDto(savedOrder);
    }

    @Override
    public List<OrderDTO> getLoggedInUserOrders() {
        User user = getAuthenticatedUser();
        return orderRepository.findByUser(user).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        return orderMapper.toDto(orderRepository.save(order));
    }
}
