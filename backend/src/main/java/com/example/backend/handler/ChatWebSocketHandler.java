package com.example.backend.handler;

import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.TextMessage;
import com.example.backend.response.MessageResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Map<String, WebSocketSession> users = new ConcurrentHashMap<>();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userEmail = (String) session.getAttributes().get("email");
        if (userEmail != null) {
            users.put(userEmail, session);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // Parse the incoming message and send it to the appropriate user(s)
        String messageContent = message.getPayload();
        MessageResponse messageResponse = objectMapper.readValue(messageContent, MessageResponse.class);

        // Broadcast message to all clients connected to the product
        for (WebSocketSession userSession : users.values()) {
            if (userSession.isOpen()) {
                userSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(messageResponse)));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        users.values().remove(session);
    }
}
