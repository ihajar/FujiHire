package com.fujihire.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;
import com.fujihire.features.authentication.utils.Encoder;

@Configuration
public class LoadDatabaseConfiguration {

    private final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner initDatabse(AuthUserRepository authUserRepository) {
        return args -> {
            AuthUser authUser = new AuthUser("hadjer@email.com", encoder.encode("hadjer"));
            authUserRepository.save(authUser);
        };
    }
    
}
