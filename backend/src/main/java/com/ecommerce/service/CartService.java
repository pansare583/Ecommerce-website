package com.ecommerce.service;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;

public interface CartService {
    CartItemDTO addItemToCart(Long productId, Integer quantity);
    CartItemDTO updateItemQuantity(Long cartItemId, Integer quantity);
    void removeItemFromCart(Long cartItemId);
    CartDTO getLoggedInUserCart();
    void clearCart();
}
