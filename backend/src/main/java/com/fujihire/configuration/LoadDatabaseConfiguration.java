package com.fujihire.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.repository.AuthUserRepository;

@Configuration
public class LoadDatabaseConfiguration {

    @Bean
    public CommandLineRunner initDatabse(AuthUserRepository authUserRepository) {
        return args -> {
            AuthUser authUser = new AuthUser("hadjer@email.com", "hadjer");
            authUserRepository.save(authUser);
        };
    }
    
}
