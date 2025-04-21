package com.fujihire.features.authentication.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;


@Entity(name = "users")
public class AuthUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotNull
    @Column(unique = true)
    private String email;

    private Boolean emailVerified = false;
    private String emailVerificationToken = null;
    private LocalDateTime emailVerificationTokenExpiryDate = null;

    @JsonIgnore
    private String password;
    private String passwordResetToken = null;
    private LocalDateTime passwordResetTokenExpiryDate = null;


    public AuthUser( String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthUser() {}

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public Boolean getEmailVerified() { return emailVerified; }
    public String getEmailVerificationToken() { return emailVerificationToken; }
    public LocalDateTime getEmailVerificationTokenExpiryDate() { return emailVerificationTokenExpiryDate; }
    public String getPassword() { return password; }
    public String getPasswordResetToken() { return passwordResetToken; }
    public LocalDateTime getPasswordResetTokenExpiryDate() { return passwordResetTokenExpiryDate; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }
    public void setEmailVerificationTokenExpiryDate(LocalDateTime emailverificationExpiryDate) { this.emailVerificationTokenExpiryDate = emailVerificationTokenExpiryDate; }
    public void setPassword(String password) { this.password = password; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }
    public void setPasswordResetTokenExpiryDate(LocalDateTime passwordResetTokenExpiryDate) { this.passwordResetTokenExpiryDate = passwordResetTokenExpiryDate; }

}
