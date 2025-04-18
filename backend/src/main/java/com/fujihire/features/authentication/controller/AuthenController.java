package com.fujihire.features.authentication.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenController {
    private final AuthService authService;
    public AuthenController(AuthService authService) {
        this.authService = authService;
    }
    
    @GetMapping("/user")
    public AuthUser getUser() {
        return authService.getUser("hadjer@email.com");
    }
}