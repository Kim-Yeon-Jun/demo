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
    }
}











//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//    private final ChatWebSocketHandler chatWebSocketHandler;
//
//    @Autowired
//    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler) {
//        this.chatWebSocketHandler = chatWebSocketHandler;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(chatWebSocketHandler, "/ws/chat")
//                .setAllowedOrigins("http://localhost:3000")  // CORS 설정 허용
//                .withSockJS();  // SockJS 사용
//    }
//}