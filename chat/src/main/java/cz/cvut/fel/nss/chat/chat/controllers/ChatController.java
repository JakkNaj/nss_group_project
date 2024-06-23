package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.services.ChatService;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@Slf4j
@MessageMapping("/chat")
@RequestMapping("/chat")
public class ChatController {
    LoggingClient loggingClient = new LoggingClient("chat");

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate, ChatService chatService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatService.saveAndSendMessage(chatMessage);
    }


    /**
     * Subscribe a user to a chat room
     * @param chatMessage The initial request to subscribe to a chat room
     * @return The chat message
     */
    @PostMapping("/addUserToChat")
    public ResponseEntity<ChatRoom> addUser(@RequestBody ChatMessage chatMessage) {
        ChatRoom chatRoom = chatService.addUserToChat(chatMessage);
        loggingClient.logInfo("Added user to chat room: " + chatRoom);
        return new ResponseEntity<>(chatRoom, HttpStatus.OK);
    }

    public void sendMessageToClient(ChatMessage chatMessage, Integer userId) {
        log.info("Sending message {} to user {}", chatMessage,  userId);
        simpMessagingTemplate.convertAndSend("/userId/" + userId, chatMessage.toDto());
    }
}
