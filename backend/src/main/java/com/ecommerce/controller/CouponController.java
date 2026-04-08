package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @GetMapping("/validate/{code}")
    public ResponseEntity<Map<String, Object>> validateCoupon(@PathVariable String code) {
        if ("SAVE10".equalsIgnoreCase(code)) {
            return ResponseEntity.ok(Map.of("valid", true, "discount", 10));
        } else if ("WELCOME20".equalsIgnoreCase(code)) {
            return ResponseEntity.ok(Map.of("valid", true, "discount", 20));
        } else {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Invalid coupon code"));
        }
    }
}
