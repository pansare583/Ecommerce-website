package com.ecommerce.service.impl;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.mapper.CartItemMapper;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemMapper cartItemMapper;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String identifier;
        if (principal instanceof UserDetails) {
            identifier = ((UserDetails) principal).getUsername();
        } else {
            identifier = principal.toString();
        }
        return userRepository.findByEmail(identifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with prinicpal: " + identifier));
    }

    @Override
    @Transactional
    public CartItemDTO addItemToCart(Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be positive");
        }

        User user = getAuthenticatedUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProductId(user, productId)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(0)
                        .build());

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        CartItem savedItem = cartItemRepository.save(cartItem);
        return cartItemMapper.toDto(savedItem);
    }

    @Override
    @Transactional
    public CartItemDTO updateItemQuantity(Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be positive");
        }

        User user = getAuthenticatedUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized access to cart item");
        }

        cartItem.setQuantity(quantity);
        CartItem updatedItem = cartItemRepository.save(cartItem);
        return cartItemMapper.toDto(updatedItem);
    }

    @Override
    @Transactional
    public void removeItemFromCart(Long cartItemId) {
        User user = getAuthenticatedUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized access to cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    public CartDTO getLoggedInUserCart() {
        User user = getAuthenticatedUser();
        List<CartItem> items = cartItemRepository.findByUser(user);

        List<CartItemDTO> itemDtos = items.stream()
                .map(cartItemMapper::toDto)
                .collect(Collectors.toList());

        BigDecimal total = itemDtos.stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartDTO cartDTO = new CartDTO();
        cartDTO.setItems(itemDtos);
        cartDTO.setTotalAmount(total);
        return cartDTO;
    }

    @Override
    @Transactional
    public void clearCart() {
        User user = getAuthenticatedUser();
        cartItemRepository.deleteByUser(user);
    }
}
