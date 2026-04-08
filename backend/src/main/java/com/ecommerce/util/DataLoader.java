package com.ecommerce.util;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Product p1 = Product.builder()
                    .name("iPhone 15 Pro")
                    .description("Latest Apple iPhone with titanium design")
                    .price(new BigDecimal("999.99"))
                    .stock(50)
                    .imageUrl("/images/iphone_15_pro.png")
                    .category("Smartphones")
                    .build();

            Product p2 = Product.builder()
                    .name("Sony WH-1000XM5")
                    .description("Industry leading noise canceling headphones")
                    .price(new BigDecimal("399.99"))
                    .stock(100)
                    .imageUrl("/images/sony_headphones.png")
                    .category("Audio")
                    .build();

            Product p3 = Product.builder()
                    .name("Sony PlayStation 5 Slim")
                    .description("Updated compact version of the PS5")
                    .price(new BigDecimal("449.99"))
                    .stock(40)
                    .imageUrl("/images/ps5_slim.png")
                    .category("Gaming")
                    .build();

            Product p4 = Product.builder()
                    .name("MacBook Pro 14")
                    .description("Powerful M3 Pro chip with liquid retina display")
                    .price(new BigDecimal("1999.99"))
                    .stock(20)
                    .imageUrl("/images/laptop.png")
                    .category("Laptops")
                    .build();

            Product p5 = Product.builder()
                    .name("Samsung Galaxy S24 Ultra")
                    .description("Flagship with AI features and S-pen")
                    .price(new BigDecimal("1199.99"))
                    .stock(30)
                    .imageUrl("/images/iphone_15_pro.png") // Placeholder for now or I can gen more
                    .category("Smartphones")
                    .build();

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));
        }

        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .email("pansarepriti09@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .isVerified(true)
                    .build();

            User user = User.builder()
                    .username("user")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_USER)
                    .isVerified(true)
                    .build();

            userRepository.saveAll(Arrays.asList(admin, user));
        }
    }
}
