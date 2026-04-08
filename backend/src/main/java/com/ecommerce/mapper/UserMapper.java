package com.ecommerce.mapper;

import com.ecommerce.dto.UserDTO;
import com.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);
    
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "verificationCode", ignore = true)
    User toEntity(UserDTO userDTO);
}
