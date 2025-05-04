package com.fujihire.features.authentication.dto;

import com.fujihire.features.authentication.model.UserRole;

public class AuthResponseBody {
    private final String token;
    private final String message;
    private final UserRole role;

    public AuthResponseBody(String token, String message, UserRole role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    public String getToken() {
        return token;
    }
    public String getMessage() {
        return message;
    }
    public UserRole getRole() {
        return role;
    }
}
