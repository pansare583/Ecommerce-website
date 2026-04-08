package com.ecommerce.service.impl;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.WishlistItem;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.WishlistItemRepository;
import com.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistItemRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String identifier;
        if (principal instanceof UserDetails) {
            identifier = ((UserDetails) principal).getUsername();
        } else {
            identifier = principal.toString();
        }
        return userRepository.findByEmail(identifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with principal: " + identifier));
    }

    @Override
    @Transactional
    public void addToWishlist(Long productId) {
        User user = getAuthenticatedUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!wishlistRepository.findByUserAndProductId(user, productId).isPresent()) {
            WishlistItem item = WishlistItem.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(item);
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long productId) {
        User user = getAuthenticatedUser();
        wishlistRepository.deleteByUserAndProductId(user, productId);
    }

    @Override
    public List<Product> getWishlist() {
        User user = getAuthenticatedUser();
        return wishlistRepository.findByUser(user).stream()
                .map(WishlistItem::getProduct)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isInWishlist(Long productId) {
        User user = getAuthenticatedUser();
        return wishlistRepository.findByUserAndProductId(user, productId).isPresent();
    }
}
