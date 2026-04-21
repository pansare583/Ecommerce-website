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
        if (productRepository.count() <= 10) {
            // productRepository.deleteAll(); // Removed to avoid FK violation if products are already ordered
            // --- Smartphones ---
            productRepository.saveAll(Arrays.asList(
                // --- Electronics (7) ---
                Product.builder().name("iPhone 15 Pro").description("Titanium design, A17 Pro chip.").price(new BigDecimal("134900.00")).stock(50).imageUrl("https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("Samsung S24 Ultra").description("AI features and S-Pen powerhouse.").price(new BigDecimal("129999.00")).stock(30).imageUrl("https://images.unsplash.com/photo-1707240890250-8de6f610427e?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("Sony WH-1000XM5").description("Industry-leading noise cancellation.").price(new BigDecimal("29990.00")).stock(100).imageUrl("https://images.unsplash.com/photo-1675243952541-1199a4e6988f?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("AirPods Pro (2nd Gen)").description("Active Noise Cancellation, USB-C.").price(new BigDecimal("24900.00")).stock(75).imageUrl("https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("MacBook Pro M3").description("The world's most advanced pro laptop.").price(new BigDecimal("169900.00")).stock(20).imageUrl("https://images.unsplash.com/photo-1517336714460-d150854492d1?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("Dell XPS 13").description("Stunning 4K display, compact power.").price(new BigDecimal("115000.00")).stock(15).imageUrl("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000").category("Electronics").build(),
                Product.builder().name("PlayStation 5 Slim").description("Lightning-fast loading, ultra-high speed SSD.").price(new BigDecimal("44990.00")).stock(40).imageUrl("https://images.unsplash.com/photo-1606813907291-d86ebb9954ad?q=80&w=1000").category("Electronics").build(),

                // --- Fashion (6) ---
                Product.builder().name("Classic Trench Coat").description("Elegant beige trench coat for any season.").price(new BigDecimal("7999.00")).stock(25).imageUrl("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000").category("Fashion").build(),
                Product.builder().name("Cotton Oxford Shirt").description("Premium white cotton shirt, tailored fit.").price(new BigDecimal("2499.00")).stock(60).imageUrl("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000").category("Fashion").build(),
                Product.builder().name("High-Waist Denim").description("Comfortable stretch denim, vintage look.").price(new BigDecimal("3599.00")).stock(45).imageUrl("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000").category("Fashion").build(),
                Product.builder().name("Leather Biker Jacket").description("Rugged black leather for a timeless style.").price(new BigDecimal("12999.00")).stock(15).imageUrl("https://images.unsplash.com/photo-1551028719-0116384047ef?q=80&w=1000").category("Fashion").build(),
                Product.builder().name("Floral Midi Dress").description("Lightweight silk dress for summer outings.").price(new BigDecimal("4599.00")).stock(20).imageUrl("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000").category("Fashion").build(),
                Product.builder().name("Merino Wool Sweater").description("Soft, warm knit in charcoal grey.").price(new BigDecimal("3299.00")).stock(30).imageUrl("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000").category("Fashion").build(),

                // --- Shoes (6) ---
                Product.builder().name("Air Jordan 1 Low").description("Classic university blue and white.").price(new BigDecimal("8995.00")).stock(20).imageUrl("https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000").category("Shoes").build(),
                Product.builder().name("UltraBoost 22").description("Epic energy return for every run.").price(new BigDecimal("12999.00")).stock(35).imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000").category("Shoes").build(),
                Product.builder().name("Classic White Sneakers").description("Minimalist leather sneakers for work or play.").price(new BigDecimal("4999.00")).stock(50).imageUrl("https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000").category("Shoes").build(),
                Product.builder().name("Canvas High Tops").description("Durable canvas shoes with a vintage edge.").price(new BigDecimal("2299.00")).stock(80).imageUrl("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000").category("Shoes").build(),
                Product.builder().name("Velvet Slippers").description("Luxurious comfort for relaxing at home.").price(new BigDecimal("1899.00")).stock(40).imageUrl("https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000").category("Shoes").build(),
                Product.builder().name("Rugged Work Boots").description("Water-resistant leather for harsh conditions.").price(new BigDecimal("6599.00")).stock(25).imageUrl("https://images.unsplash.com/photo-1520639889313-7313c0afb2c0?q=80&w=1000").category("Shoes").build(),

                // --- Accessories (6) ---
                Product.builder().name("Minimalist Gold Watch").description("Sleek gold-tone watch, vegan strap.").price(new BigDecimal("5499.00")).stock(30).imageUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000").category("Accessories").build(),
                Product.builder().name("Leather Bi-fold Wallet").description("Premium Italian leather, RFID protection.").price(new BigDecimal("1999.00")).stock(80).imageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000").category("Accessories").build(),
                Product.builder().name("Silk Necktie").description("Navy silk with subtle floral pattern.").price(new BigDecimal("1499.00")).stock(40).imageUrl("https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=1000").category("Accessories").build(),
                Product.builder().name("Classic Aviators").description("Polarized lenses with a golden frame.").price(new BigDecimal("3999.00")).stock(25).imageUrl("https://images.unsplash.com/photo-1511499767390-90342f568952?q=80&w=1000").category("Accessories").build(),
                Product.builder().name("Canvas Backpack").description("Large capacity bag for city explorers.").price(new BigDecimal("2899.00")).stock(50).imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000").category("Accessories").build(),
                Product.builder().name("Silver Cufflinks").description("Polished sterling silver for formal wear.").price(new BigDecimal("1299.00")).stock(100).imageUrl("https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=1000").category("Accessories").build()
            ));
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
