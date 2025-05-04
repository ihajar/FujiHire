package com.fujihire.features.authentication.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fujihire.features.authentication.dto.AuthRequestBody;
import com.fujihire.features.authentication.dto.AuthResponseBody;
import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;
import com.fujihire.features.authentication.utils.EmailService;
import com.fujihire.features.authentication.utils.Encoder;
import com.fujihire.features.authentication.utils.JsonWebToken;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;


@Service
public class AuthService {
    private final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;
    private final EmailService emailService;

    private final AuthUserRepository authUserRepository;
    private final int durationInMinutes = 1;

    @PersistenceContext
    private EntityManager entityManager;

    public AuthService(Encoder encoder, JsonWebToken jWebToken, EmailService emailService, AuthUserRepository authUserRepository) {
        this.encoder = encoder;
        this.jsonWebToken = jWebToken;
        this.emailService = emailService;
        this.authUserRepository = authUserRepository;
    }

    public AuthUser getUser(String email) {
        System.out.println("Querying user with email: " + email);
        Optional<AuthUser> userOptional = authUserRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            System.out.println("User found: " + userOptional.get());
            return userOptional.get();
        } else {
            System.out.println("User not found for email: " +email);
            throw new IllegalArgumentException("User not found.");
        }
        // logger.info("Trying to load user by email: {}", email);
        // return authUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    public static String generateEmailVerificationToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(5);
        for (int i = 0; i < 5; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public void sendEmailVerificationToken(String email) {
        Optional<AuthUser> user = authUserRepository.findByEmail(email);
        if (user.isPresent() && !user.get().getEmailVerified()) {
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authUserRepository.save(user.get());
            String subject = "Email Verification";
            String body = String.format("Only one step to take full advantage of FujiHire.\n\n"
                    + "Enter this code to verify your email: " + "%s\n\n" + "The code will expire in " + "%s"
                    + "minutes.", 
                    emailVerificationToken, durationInMinutes);
            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("Email verification token failed, or email is already verified.");
        }
    }

    public void validateEmaileVerificationToken(String token, String email) {
        Optional<AuthUser> user = authUserRepository.findByEmail(email);
        if (user.isPresent() && 
            encoder.matches(token, user.get().getEmailVerificationToken()) && 
            !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);
            authUserRepository.save(user.get());
        } else if (user.isPresent() && 
                    encoder.matches(token, user.get().getEmailVerificationToken()) && 
                    user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Email verification token expired.");
        } else {
            throw new IllegalArgumentException("Email verification token failed.");
        }

    }

    public AuthResponseBody login(AuthRequestBody loginRequestBody) {
        AuthUser user = authUserRepository.findByEmail(loginRequestBody.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        logger.info("Trying to login user by email: {}", loginRequestBody.getEmail());
        if (!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect!");
        }
        String token = jsonWebToken.generateToken(loginRequestBody.getEmail());
        return new AuthResponseBody(token, "Authentication succeeded.", user.getRole());
    }

    public AuthResponseBody register(AuthRequestBody registeRequestBody) {
        AuthUser user = authUserRepository.save(new AuthUser(
            registeRequestBody.getEmail(), 
            encoder.encode(registeRequestBody.getPassword()),
            registeRequestBody.getRole()
        ));
        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

        authUserRepository.save(user);

        String subject = "Email Verification";
        String body = String.format("""
                Only one step to take full advantage of FujiHire.
                Enter this code to verify your email: %s. The code will expire in %s minutes.""",
                emailVerificationToken, durationInMinutes);
        
        try {
            emailService.sendEmail(registeRequestBody.getEmail(), subject, body);
        } catch (Exception e) {
            logger.info("Error while sending email: {}", e.getMessage());
        }

        String authToken = jsonWebToken.generateToken(registeRequestBody.getEmail());
        return new AuthResponseBody(authToken, "User registered successfully.", user.getRole());
    }

    public void sendPasswordResetToken(String email) {
        Optional<AuthUser> user = authUserRepository.findByEmail(email);
        if (user.isPresent()) {
            String passwordResetToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(passwordResetToken);
            user.get().setPasswordResetToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authUserRepository.save(user.get());
            String subject = "Password Reset";
            String body = String.format("""
                    You request a password reset.
                    Enter this code to reset your password: %s. The code will expire in %s minutes""",
                    passwordResetToken, durationInMinutes);
            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("User not found!");
        }
    }

    public void resetPassword(String email, String newPassword, String token) {
        Optional<AuthUser> user = authUserRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
            && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setPasswordResetToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);
            user.get().setPassword(encoder.encode(newPassword));
            authUserRepository.save(user.get());
        } else if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
                    && user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token expired.");
        } else {
            throw new IllegalArgumentException("Password reset token failed.");
        }
    }

    public AuthUser getUserById(Long receivedId) {
        return authUserRepository.findById(receivedId).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    public AuthUser updateUserProfile(AuthUser user, String firstName, String lastName, String company, String position, String location, String about) {
        if (firstName != null) {
            user.setFirstName(firstName);
        }
        if (lastName != null) {
            user.setLastName(lastName);
        }
        if (company != null) {
            user.setCompany(company);
        }
        if (position != null) {
            user.setPosition(position);
        }
        if (location != null) {
            user.setLocation(location);
        }
        if (about != null) {
            user.setAbout(about);
        }
        return authUserRepository.save(user);
    }
}
