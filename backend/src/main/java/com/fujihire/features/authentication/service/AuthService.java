package com.fujihire.features.authentication.service;

import org.springframework.stereotype.Service;

import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;

@Service
public class AuthService {
    private final AuthUserRepository authUserRepository;

    public AuthService(AuthUserRepository authUserRepository) {
        this.authUserRepository = authUserRepository;
    }

    public AuthUser getUser(String email) {
        return authUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }


}
