package com.smartprint.smartservice.configs;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

/**
 * Intercepts the STOMP CONNECT frame and promotes the email stored by the
 * handshake interceptor into a proper Principal on the STOMP session.
 * This enables Spring's /user destination resolution so that
 * convertAndSendToUser(email, "/queue/...", payload) reaches the right client.
 */
@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
            if (sessionAttributes != null) {
                String email = (String) sessionAttributes.get("principal");
                if (email != null) {
                    accessor.setUser(new UsernamePasswordAuthenticationToken(
                            email, null, Collections.emptyList()));
                }
            }
        }
        return message;
    }
}