package com.ecommerce.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String code) {
        String html = "<html><body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>"
                + "<h2 style='color: #9333EA;'>Welcome to Trendify! 🛍️</h2>"
                + "<p>Verify your account to enjoy the best shopping experience.</p>"
                + "<div style='background: #f8f6ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2D1F5E;'>"
                + code + "</div>"
                + "<p style='color: #666;'>Please enter this code on the website to verify your account. If you didn't request this, ignore it.</p>"
                + "</div></body></html>";
        sendHtmlEmail(to, "Trendify - Verify Your Account", html);
    }

    @Async
    public void sendLoginOtp(String to, String code) {
        String html = "<html><body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>"
                + "<h2 style='color: #9333EA;'>Secure Login 🗝️</h2>"
                + "<p>Use the code below to securely sign in to your dashboard.</p>"
                + "<div style='background: #f8f6ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2D1F5E;'>"
                + code + "</div>"
                + "<p style='color: #666; font-size: 13px;'>This code will expire in 10 minutes for your security.</p>"
                + "</div></body></html>";
        sendHtmlEmail(to, "Trendify - Login Verification Code", html);
    }

    @Async
    public void sendOrderConfirmation(String to, com.ecommerce.dto.OrderDTO order) {
        StringBuilder itemsHtml = new StringBuilder();
        for (com.ecommerce.dto.OrderItemDTO item : order.getItems()) {
            itemsHtml.append("<tr>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #eee;'>")
                    .append(item.getProductName()).append(" (x").append(item.getQuantity()).append(")</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>₹")
                    .append(item.getTotalPrice()).append("</td>")
                    .append("</tr>");
        }

        String html = "<html><body style='font-family: Arial, sans-serif; color: #444;'>"
                + "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;'>"
                + "<div style='background: #9333EA; padding: 30px; text-align: center; color: white;'>"
                + "<h1 style='margin: 0;'>Order Confirmed! 🌸</h1>"
                + "<p style='margin: 10px 0 0;'>Order ID: #" + order.getId() + "</p></div>"
                + "<div style='padding: 30px;'>"
                + "<h3>Receipt Detail</h3>"
                + "<table style='width: 100%; border-collapse: collapse;'>"
                + itemsHtml.toString()
                + "<tr style='font-weight: bold; color: #9333EA; font-size: 18px;'>"
                + "<td style='padding: 20px 10px;'>Grand Total</td>"
                + "<td style='padding: 20px 10px; text-align: right;'>₹" + order.getTotalAmount() + "</td></tr>"
                + "</table>"
                + "<div style='margin-top: 30px; padding: 20px; background: #fdfbff; border-radius: 10px;'>"
                + "<h4 style='margin-top: 0;'>Shipping Address</h4>"
                + "<p style='font-size: 14px; color: #555;'>" + order.getShippingAddress() + "<br/>"
                + order.getCity() + ", " + order.getState() + " " + order.getZipCode() + "</p></div>"
                + "<p style='margin-top: 25px; text-align: center; font-size: 14px; color: #888;'>We'll notify you as soon as your items are shipped! Thank you for shopping with us.</p>"
                + "</div></div></body></html>";
        
        sendHtmlEmail(to, "Trendify - Order Receipt #" + order.getId(), html);
    }

    @Async
    public void sendNewsletterWelcome(String to) {
        String html = "<html><body style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>"
                + "<h2 style='color: #9333EA;'>Welcome to the Fashion Insider! 🥂</h2>"
                + "<p>Thanks for subscribing to the Trendify newsletter. You're now on the list for exclusive deals, early access to new arrivals, and style inspiration.</p>"
                + "<div style='background: #f8f6ff; padding: 15px; border-radius: 8px; text-align: center; color: #6b21a8; font-weight: bold;'>"
                + "Use code <b>WELCOME20</b> for 20% off your next order!"
                + "</div>"
                + "<p style='color: #666; font-size: 13px; margin-top: 20px;'>Stay trendy,<br>The Trendify Team</p>"
                + "</div></body></html>";
        sendHtmlEmail(to, "Welcome to Trendify Newsletter ✨", html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("CRITICAL: Failed to send HTML email to " + to + ": " + e.getMessage());
        }
    }
}
