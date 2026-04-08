package com.ecommerce.service.impl;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.SignupRequest;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Find user first to check verification
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found with email: " + loginRequest.getEmail()));

        if (!user.isVerified()) {
            throw new RuntimeException("Error: Account not verified. Please check your email.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Instead of returning JWT immediately, in a real OTP flow, we'd send OTP here.
        // But the user said "send email at login to verify user". 
        // I will implement a step: Login -> Send OTP -> Verify OTP -> Get Token.
        
        String otp = generateOtp();
        user.setVerificationCode(otp);
        userRepository.save(user);
        
        emailService.sendLoginOtp(user.getEmail(), otp);
        
        // Return a response indicating OTP is required
        return new JwtResponse("OTP_REQUIRED", user.getUsername(), user.getRole().name());
    }

    @Override
    public JwtResponse verifyLoginOtp(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
            user.setVerificationCode(null);
            userRepository.save(user);
            
            // Generate token since OTP is correct
            String jwt = jwtUtils.generateJwtTokenViaEmail(email, user.getRole().name());
            return new JwtResponse(jwt, user.getUsername(), user.getRole().name());
        } else {
            throw new RuntimeException("Error: Invalid OTP code");
        }
    }

    @Override
    public String registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        String verificationCode = generateOtp();

        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(encoder.encode(signupRequest.getPassword()))
                .role(Role.ROLE_USER)
                .isVerified(false)
                .verificationCode(verificationCode)
                .build();

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return "User registered successfully! Please check your email for the verification code.";
    }

    @Override
    public boolean verifyAccount(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        
        if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
            user.setVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public void sendLoginOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found"));
        String otp = generateOtp();
        user.setVerificationCode(otp);
        userRepository.save(user);
        emailService.sendLoginOtp(email, otp);
    }

    private String generateOtp() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
