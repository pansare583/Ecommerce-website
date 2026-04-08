package com.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;

public interface PaymentService {
    PaymentIntent createPaymentIntent(BigDecimal amount) throws StripeException;
}
