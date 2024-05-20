package com.example.demo.Config;

import com.example.demo.Service.ChatWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메시지 브로커 설정
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // STOMP 엔드포인트 설정
        registry.addEndpoint("/ws/chat")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();

        // 위치 정보 엔드포인트
        registry.addEndpoint("/ws/location")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }
}