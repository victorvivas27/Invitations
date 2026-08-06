package com.invitation.auth.infrastructure;

import com.invitation.auth.application.port.TokenValidator;
import com.invitation.auth.domain.AuthenticatedUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";
    private final TokenValidator validator;
    private final RestAuthenticationEntryPoint entryPoint;

    public JwtAuthenticationFilter(TokenValidator validator, RestAuthenticationEntryPoint entryPoint) {
        this.validator = validator;
        this.entryPoint = entryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authorization.substring(BEARER_PREFIX.length()).trim();
        Optional<AuthenticatedUser> principal = validator.validate(token);
        if (principal.isEmpty()) {
            entryPoint.commence(request, response, null);
            return;
        }
        AuthenticatedUser user = principal.orElseThrow();
        var authentication = new UsernamePasswordAuthenticationToken(user, null,
                List.of(new SimpleGrantedAuthority("STATUS_" + user.status().name())));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
