package com.fujihire.features.authentication.model;

import java.time.LocalDateTime;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

@Entity(name = "users")
@Indexed(index = "users")
public class AuthUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotNull
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull
    private UserRole role;

    private Boolean emailVerified = false;
    private String emailVerificationToken = null;
    private LocalDateTime emailVerificationTokenExpiryDate = null;

    @JsonIgnore
    private String password;
    private String passwordResetToken = null;
    private LocalDateTime passwordResetTokenExpiryDate = null;

    @FullTextField(analyzer = "standard")
    private String firstName = null;
    @FullTextField(analyzer = "standard")
    private String lastName = null;
    @FullTextField(analyzer = "standard")
    private String company = null;
    @FullTextField(analyzer = "standard")
    private String position = null;

    private String location = null;
    private String profilePic = null;
    private String coverPic = null;
    private boolean profileCompleted = false;
    private String about = null;

    public AuthUser(String email, String password, UserRole role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public AuthUser() {}

    // Getters
    public Long getId() { return id; }
    public UserRole getRole() { return role; }

    public void updateProfileCompletionStatus() {
        this.profileCompleted = (this.firstName != null && this.lastName != null && this.company != null && this.position != null && this.location != null);
    }

    public String getEmail() { return email; }
    public Boolean getEmailVerified() { return emailVerified; }
    public String getEmailVerificationToken() { return emailVerificationToken; }
    public LocalDateTime getEmailVerificationTokenExpiryDate() { return emailVerificationTokenExpiryDate; }
    public String getPassword() { return password; }
    public String getPasswordResetToken() { return passwordResetToken; }
    public LocalDateTime getPasswordResetTokenExpiryDate() { return passwordResetTokenExpiryDate; }

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getLocation() { return location; }
    public String getPosition() { return position; }
    public String getCompany() { return company; }
    public Boolean getProfileCompletion() { return profileCompleted; }
    public String getProfilePic() { return profilePic; }
    public String getCoverPic() { return coverPic; }
    public String getAbout() { return about; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(UserRole role) { this.role = role; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }
    public void setEmailVerificationTokenExpiryDate(LocalDateTime emailverificationExpiryDate) {
        this.emailVerificationTokenExpiryDate = emailverificationExpiryDate;
    }
    public void setPassword(String password) { this.password = password; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }
    public void setPasswordResetTokenExpiryDate(LocalDateTime passwordResetTokenExpiryDate) { this.passwordResetTokenExpiryDate = passwordResetTokenExpiryDate; }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateProfileCompletionStatus();
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateProfileCompletionStatus();
    }
    public void setLocation(String location) {
        this.location = location;
        updateProfileCompletionStatus();
    }
    public void setPosition(String position) {
        this.position = position;
        updateProfileCompletionStatus();
    }
    public void setCompany(String company) {
        this.company = company;
    }
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    public void setCoverPic(String coverPic) {
        this.coverPic = coverPic;
    }
    public void setAbout(String about) {
        this.about = about;
    }
}
