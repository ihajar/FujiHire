package com.fujihire.features.authentication.service;

import org.springframework.stereotype.Service;

import com.fujihire.features.authentication.dto.AuthRequestBody;
import com.fujihire.features.authentication.dto.AuthResponseBody;
import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;
import com.fujihire.features.authentication.utils.Encoder;
import com.fujihire.features.authentication.utils.JsonWebToken;

@Service
public class AuthService {
    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;

    private final AuthUserRepository authUserRepository;

    public AuthService(Encoder encoder, JsonWebToken jWebToken, AuthUserRepository authUserRepository) {
        this.encoder = encoder;
        this.jsonWebToken = jWebToken;
        this.authUserRepository = authUserRepository;
    }

    public AuthUser getUser(String email) {
        return authUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    public AuthResponseBody login(AuthRequestBody loginRequestBody) {
        AuthUser user = authUserRepository.findByEmail(loginRequestBody.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        if (!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect!");
        }
        String token = jsonWebToken.generateToken(loginRequestBody.getEmail());
        return new AuthResponseBody(token, "Authentication succeeded.");
    }

    public AuthResponseBody register(AuthRequestBody registeRequestBody) {
        AuthUser user = authUserRepository.save(new AuthUser(registeRequestBody.getEmail(), encoder.encode(registeRequestBody.getPassword())));
        authUserRepository.save(user);
        String token = jsonWebToken.generateToken(registeRequestBody.getEmail());
        return new AuthResponseBody(token, "User registred successfully.");
    }

}
