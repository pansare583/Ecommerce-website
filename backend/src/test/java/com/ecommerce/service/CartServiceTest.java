package com.ecommerce.service;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.mapper.CartItemMapper;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.impl.CartServiceImpl;
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
public class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartItemMapper cartItemMapper;

    @InjectMocks
    private CartServiceImpl cartService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User user;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).username("testuser").role(Role.ROLE_USER).build();
        product = Product.builder().id(1L).name("Test Product").price(new BigDecimal("50.00")).build();
        cartItem = CartItem.builder().id(1L).user(user).product(product).quantity(1).build();

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mock(UserDetails.class));
        when(((UserDetails) authentication.getPrincipal()).getUsername()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
    }

    @Test
    void testAddItemToCart() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProductId(user, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);
        when(cartItemMapper.toDto(any(CartItem.class))).thenReturn(new CartItemDTO());

        CartItemDTO result = cartService.addItemToCart(1L, 1);

        assertNotNull(result);
        verify(cartItemRepository, times(1)).save(any());
    }

    @Test
    void testGetLoggedInUserCart() {
        when(cartItemRepository.findByUser(user)).thenReturn(Collections.singletonList(cartItem));
        CartItemDTO dto = new CartItemDTO();
        dto.setPrice(new BigDecimal("50.00"));
        dto.setQuantity(1);
        when(cartItemMapper.toDto(cartItem)).thenReturn(dto);

        CartDTO cart = cartService.getLoggedInUserCart();

        assertNotNull(cart);
        assertEquals(new BigDecimal("50.00"), cart.getTotalAmount());
        assertEquals(1, cart.getItems().size());
    }
}
