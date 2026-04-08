package com.ecommerce.controller;

import com.ecommerce.entity.ContactMessage;
import com.ecommerce.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactRepository;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactMessage message) {
        if (message.getEmail() == null || message.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
        }
        
        contactRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Thank you for contacting us. We will get back to you shortly."));
    }
}
