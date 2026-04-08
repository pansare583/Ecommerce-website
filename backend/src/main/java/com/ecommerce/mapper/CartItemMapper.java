package com.ecommerce.mapper;

import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "price")
    @Mapping(source = "product.imageUrl", target = "imageUrl")
    @Mapping(target = "totalPrice", expression = "java(cartItem.getProduct() != null && cartItem.getProduct().getPrice() != null ? cartItem.getProduct().getPrice().multiply(new java.math.BigDecimal(cartItem.getQuantity())) : java.math.BigDecimal.ZERO)")
    CartItemDTO toDto(CartItem cartItem);
}
