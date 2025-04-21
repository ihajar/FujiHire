package com.fujihire.features.authentication.service;

import org.springframework.stereotype.Service;

import com.fujihire.features.authentication.dto.AuthRequestBody;
import com.fujihire.features.authentication.dto.AuthResponseBody;
import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;
import com.fujihire.features.authentication.utils.Encoder;

@Service
public class AuthService {
    private final Encoder encoder;

    private final AuthUserRepository authUserRepository;

    public AuthService(Encoder encoder, AuthUserRepository authUserRepository) {
        this.encoder = encoder;
        this.authUserRepository = authUserRepository;
    }
    
    public AuthUser getUser(String email) {
        return authUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    public AuthResponseBody register(AuthRequestBody registeRequestBody) {
        authUserRepository.save(new AuthUser(registeRequestBody.getEmail(), encoder.encode(registeRequestBody.getPassword())));
        return new AuthResponseBody("token", "User registred successfully");
    }

}
