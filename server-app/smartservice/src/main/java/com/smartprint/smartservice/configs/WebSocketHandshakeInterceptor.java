package com.smartprint.smartservice.configs;

import com.smartprint.smartservice.security.AuthCookieService;
import com.smartprint.smartservice.services.AppUserDetailsService;
import com.smartprint.smartservice.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTService jwtService;
    private final AuthCookieService authCookiesService;
    private final ApplicationContext applicationContext;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            HttpServletRequest httpRequest = ((ServletServerHttpRequest) request).getServletRequest();
            String token = authCookiesService.extractAccessToken(httpRequest);
            String username = null;
            if(token != null){
                username = jwtService.extractEmail(token);
            }

            if(username != null){
                UserDetails userDetails = applicationContext.getBean(AppUserDetailsService.class).loadUserByUsername(username);

                if(jwtService.validateToken(token, userDetails)){
                    attributes.put("principal", username);
                }
            }
        }
        // Always allow the connection. Unauthenticated users can subscribe to
        // public /topic destinations but will not receive user-specific messages.
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }
}