package com.ecommerce.service;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderStatus;
import com.ecommerce.entity.User;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.impl.OrderServiceImpl;
import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartService cartService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private com.ecommerce.repository.ProductRepository productRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User user;
    private Order order;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("test@example.com").username("testuser").build();
        order = Order.builder().id(1L).user(user).totalAmount(new BigDecimal("100.00")).status(OrderStatus.PAID).build();

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        UserDetails userDetails = mock(UserDetails.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
    }

    @Test
    void testCreateOrder() {
        CartDTO cartDTO = new CartDTO();
        CartItemDTO item = new CartItemDTO();
        item.setId(101L);
        item.setProductId(1L);
        item.setPrice(new BigDecimal("100.00"));
        item.setQuantity(1);
        item.setProductName("Test Product");
        cartDTO.setItems(Collections.singletonList(item));
        
        when(cartService.getLoggedInUserCart()).thenReturn(cartDTO);
        when(productRepository.findById(1L)).thenReturn(Optional.of(new com.ecommerce.entity.Product()));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderMapper.toDto(any(Order.class))).thenReturn(new OrderDTO());

        // Call with new arguments
        OrderDTO result = orderService.createOrder("CARD", Collections.singletonList(101L));

        assertNotNull(result);
        verify(orderRepository, times(1)).save(any());
        verify(cartService, times(1)).removeItemFromCart(101L);
    }
}
