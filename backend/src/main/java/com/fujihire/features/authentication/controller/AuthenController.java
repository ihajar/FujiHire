package com.fujihire.features.authentication.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fujihire.dto.PasswordResetRequest;
import com.fujihire.dto.Response;
import com.fujihire.features.authentication.dto.AuthRequestBody;
import com.fujihire.features.authentication.dto.AuthResponseBody;
import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenController {
    private final AuthService authService;
    public AuthenController(AuthService authService) {
        this.authService = authService;
    }
    
    @GetMapping("/users/me")
    public AuthUser getUser(@RequestAttribute("authenticatedUser") AuthUser authenticatedUser ) {
        // return authService.getUser(authenticatedUser.getEmail());
        return authenticatedUser;
    }

    @GetMapping("/users/{id}")
    public AuthUser getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }

    @PostMapping("/login")
    public AuthResponseBody loginUSer(@Valid @RequestBody AuthRequestBody loginRequestBody) {
        return authService.login(loginRequestBody);
    }

    @PostMapping("/register")
    public AuthResponseBody registerUser(@Valid @RequestBody AuthRequestBody registerRequestBody) {
        return authService.register(registerRequestBody);
    }

    @PutMapping("/validate-email-verification-token")
    public Response verifyEmail(@RequestParam("token") String token, @RequestAttribute("authenticatedUser") AuthUser user) {
        authService.validateEmaileVerificationToken(token, user.getEmail());
        return new Response("Email verified successfully."); 
    }

    @GetMapping("/send-email-verification-token")
    public Response sendEmailVerificationToken(@RequestAttribute("authenticatedUser") AuthUser user) {
        authService.sendEmailVerificationToken(user.getEmail());
        return new Response("Email verification token sent successfully.");
    }

    @PutMapping("/send-password-reset-token")
    public Response sendPasswordResetToken(@RequestParam("email") String email) {
        authService.sendPasswordResetToken(email);
        return new Response("Password reset token sent successfully.");
    }

    @PutMapping("/reset-password")
    public Response resetPassword(@RequestParam("newPassword") String newPassword, @RequestParam("token") String token, @RequestParam("email") String email) {
        authService.resetPassword(email, newPassword, token);
        return new Response("Password reset successfully");
    }
    
}