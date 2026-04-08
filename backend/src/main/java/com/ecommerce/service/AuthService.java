package com.ecommerce.service;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.SignupRequest;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    String registerUser(SignupRequest signupRequest);
    boolean verifyAccount(String email, String code);
    void sendLoginOtp(String email);
    JwtResponse verifyLoginOtp(String email, String code);
}
