package com.fujihire.features.authentication.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    
    @GetMapping("/user")
    public AuthUser getUser(@RequestAttribute("authenticatedUser") AuthUser authenticatedUser ) {
        return authService.getUser(authenticatedUser.getEmail());
    }

    @PostMapping("/login")
    public AuthResponseBody loginUSer(@Valid @RequestBody AuthRequestBody loginRequestBody) {
        return authService.login(loginRequestBody);
    }

    @PostMapping("/register")
    public AuthResponseBody registerUser(@Valid @RequestBody AuthRequestBody registerRequestBody) {
        return authService.register(registerRequestBody);
    }
    
}