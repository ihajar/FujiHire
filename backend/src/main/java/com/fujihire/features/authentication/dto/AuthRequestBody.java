package com.fujihire.features.authentication.dto;

import com.fujihire.features.authentication.model.UserRole;
import jakarta.validation.constraints.NotBlank;

public class AuthRequestBody {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    // @NotNull(message = "Role is required")
    private UserRole role;

    public AuthRequestBody() {}

    public AuthRequestBody(String email, String password, UserRole role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    
    public UserRole getRole() {
        return role;
    }

    public void setEmail(String email) { 
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
