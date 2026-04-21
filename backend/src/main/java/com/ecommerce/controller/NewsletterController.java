package com.ecommerce.controller;

import com.ecommerce.entity.NewsletterSubscription;
import com.ecommerce.repository.NewsletterSubscriptionRepository;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "*")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriptionRepository newsletterRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email address"));
        }

        if (newsletterRepository.findByEmail(email).isPresent()) {
            emailService.sendNewsletterWelcome(email);
            return ResponseEntity.ok(Map.of("message", "You are already subscribed! Sending you the welcome email again..."));
        }

        NewsletterSubscription subscription = NewsletterSubscription.builder()
                .email(email)
                .build();
        
        newsletterRepository.save(subscription);
        emailService.sendNewsletterWelcome(email);

        return ResponseEntity.ok(Map.of("message", "Subscribed successfully! Check your inbox for a welcome gift."));
    }
}
