package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.controllers.ChatController;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.exception.NotFoundException;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
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
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public KafkaChatListenerService(ChatController chatController, ChatRoomRepository chatRoomRepository) {
        this.chatController = chatController;
        this.chatRoomRepository = chatRoomRepository;
    }

    @KafkaListener(topics = "allChatMessages", groupId = "chat")
    public void receiveKafkaMessage(String chatMessage) {
        try {
            JSONObject jsonObject = new JSONObject(chatMessage);
            String messageLogId = jsonObject.getString("messageLogId");
            log.trace("Sending message to frontend for chat {}", messageLogId);
            Integer[] recipientIds = chatRoomRepository
                    .findById(messageLogId)
                    .map(chatRoom -> chatRoom.getMembers().toArray(new Integer[0]))
                    .orElseThrow(() -> new NotFoundException("Chatroom could not be found"));
            sendMessageToClient(new ChatMessage(jsonObject), recipientIds);
        } catch (JSONException e) {
            log.error("Issue making JSON from message", e);
            throw new RuntimeException("Issue making JSON from message", e);
        }
    }

    public void sendMessageToClient(ChatMessage chatMessage, Integer[] recipientIds) {
        for (Integer recipientId : recipientIds) {
            chatController.sendMessageToClient(chatMessage, recipientId);
        }
    }
}
