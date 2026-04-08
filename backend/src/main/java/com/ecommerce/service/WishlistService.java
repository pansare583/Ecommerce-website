package com.ecommerce.service;

import com.ecommerce.entity.Product;
import java.util.List;

public interface WishlistService {
    void addToWishlist(Long productId);
    void removeFromWishlist(Long productId);
    List<Product> getWishlist();
    boolean isInWishlist(Long productId);
}
