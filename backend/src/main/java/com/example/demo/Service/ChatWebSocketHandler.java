package com.example.demo.Service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;


public class ChatWebSocketHandler  extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketHandler.class);
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(@NotNull WebSocketSession session) throws Exception {
        sessions.add(session);
        logger.info("New WebSocket connection established: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(@NotNull WebSocketSession session, TextMessage message) throws Exception {
        logger.info("Message received: {}", message.getPayload());
        for (WebSocketSession webSocketSession : sessions) {
            if (webSocketSession.isOpen()) {
                try {
                    webSocketSession.sendMessage(message);
                } catch (IOException e) {
                    logger.error("Failed to send message", e);
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(@NotNull WebSocketSession session, @NotNull CloseStatus status) throws Exception {
        sessions.remove(session);
        logger.info("WebSocket connection closed: {}", session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("Transport error: {}", exception.getMessage());
        if (session.isOpen()) {
            session.close();
        }
        sessions.remove(session);
    }
}