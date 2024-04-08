package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.nss.chat.chat.services.ChatService;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
@Slf4j
public class ChatController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate, ChatService chatService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatService.saveMessage(chatMessage);
    }


    /**
     * Subscribe a user to a chat room
     * @param chatMessage The initial request to subscribe to a chat room
     * @param headerAccessor The header accessor
     * @return The chat message
     */
    @MessageMapping("/chat.addUser")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", chatMessage.getSender());
        chatService.addUserToChat(chatMessage);
        return chatMessage;
    }

    public void sendMessageToClient(String messageLogId, ChatMessage chatMessage) {
        simpMessagingTemplate.convertAndSend("/topic/" + messageLogId, chatMessage);
    }
}
