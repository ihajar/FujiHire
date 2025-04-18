package com.fujihire.features.authentication.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity(name = "users")
public class AuthUser {
    @Id
    private Long id;

    private String email;
    private String password;

    public AuthUser(String email, Long id, String password) {
        this.email = email;
        this.id = id;
        this.password = password;
    }


    public AuthUser() {}

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
