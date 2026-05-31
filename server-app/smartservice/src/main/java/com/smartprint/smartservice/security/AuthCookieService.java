package com.smartprint.smartservice.security;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

@Component
public class AuthCookieService {

    public static final String ACCESS_COOKIE = "sp_access_token";
    public static final String REFRESH_COOKIE = "sp_refresh_token";

    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public AuthCookieService(
            @Value("${app.jwt.expiration-ms}") long accessExpirationMs,
            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public void addAuthCookies(HttpServletResponse response, String accessToken, String refreshToken, boolean secure) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(ACCESS_COOKIE, accessToken, accessExpirationMs, secure).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(REFRESH_COOKIE, refreshToken, refreshExpirationMs, secure).toString());
    }

    public void clearAuthCookies(HttpServletResponse response, boolean secure) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(ACCESS_COOKIE, "", 0, secure).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(REFRESH_COOKIE, "", 0, secure).toString());
    }

    public String extractAccessToken(HttpServletRequest request) {
        return findCookie(request, ACCESS_COOKIE);
    }

    public String extractRefreshToken(HttpServletRequest request) {
        return findCookie(request, REFRESH_COOKIE);
    }

    private ResponseCookie buildCookie(String name, String value, long expirationMs, boolean secure) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .sameSite("Lax")
                .maxAge(Math.max(0, expirationMs / 1000))
                .build();
    }

    private String findCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
