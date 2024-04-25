package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.controllers.ChatController;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaChatListenerService {
    private final ChatController chatController;

    @Autowired
    public KafkaChatListenerService(ChatController chatController) {
        this.chatController = chatController;
    }

    @KafkaListener(topics = "allChatMessages", groupId = "chat")
    public void sendMessageToFrontend(String chatMessage) {
        try {
            JSONObject jsonObject = new JSONObject(chatMessage);
            log.trace("Sending message to frontend for chat {}", jsonObject.getString("messageLogId"));
            chatController.sendMessageToClient(jsonObject.getString("messageLogId"), new ChatMessage(jsonObject));
        } catch (JSONException e) {
            log.error("Issue making JSON from message", e);
            throw new RuntimeException("Issue making JSON from message", e);
        }
    }
}
