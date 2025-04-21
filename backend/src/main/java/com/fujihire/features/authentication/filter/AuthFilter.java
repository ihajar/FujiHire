package com.fujihire.features.authentication.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fujihire.features.authentication.model.AuthUser;
import com.fujihire.features.authentication.service.AuthService;
import com.fujihire.features.authentication.utils.JsonWebToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthFilter extends HttpFilter {
    private final List<String> unsecuredEndpoints = Arrays.asList(
    "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/send-password-reset-token",
        "/api/v1/auth/reset-password"
    );

    private final JsonWebToken jsonWebTokenService;
    public final AuthService authService;

    public AuthFilter(JsonWebToken jsonWebTokenSerive, AuthService authService) {
        this.jsonWebTokenService = jsonWebTokenSerive;
        this.authService = authService;
    }

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = request.getRequestURI();

        if (unsecuredEndpoints.contains(path) || path.startsWith("/api/v1/auth/oauth") || path.startsWith("/api/v1/storage")) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith("Bearer")) {
                throw new ServletException("Token missing!");
            }

            String token = authorization.substring(7);
            
            String email = jsonWebTokenService.getEmailFromToken(token);
            if (jsonWebTokenService.isTokenExpired(token)) {
                throw new ServletException("Invalid token");
            }
            AuthUser user = authService.getUser(email);
            request.setAttribute("authenticatedUser", user);
            chain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Invalid authentication token , or token missing.\"}");
        }
    }
}
