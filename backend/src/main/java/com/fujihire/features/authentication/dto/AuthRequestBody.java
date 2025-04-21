package com.fujihire.features.authentication.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequestBody {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public AuthRequestBody() {}

    public AuthRequestBody(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
