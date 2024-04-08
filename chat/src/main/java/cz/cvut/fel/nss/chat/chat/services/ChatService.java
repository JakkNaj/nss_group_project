package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.repositories.ChatLogRepository;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Slf4j
public class ChatService {
    private final ChatLogRepository chatLogRepository;
    private final ChatRoomRepository chatRoomRepository;

    private final KafkaChatMessageProducerService kafkaChatMessageProducerService;
    @Autowired
    public ChatService(ChatLogRepository chatLogRepository, ChatRoomRepository chatRoomRepository, KafkaChatMessageProducerService kafkaChatMessageProducerService) {
        this.chatLogRepository = chatLogRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.kafkaChatMessageProducerService = kafkaChatMessageProducerService;
    }

    public void saveMessage(ChatMessage message) {
        ChatLog chatLog = chatLogRepository.findById(message.getMessageLogId())
                .orElse(new ChatLog());
        chatLog.addMessage(message);
        log.info("Chat log: {}", chatLog);
        chatLogRepository.save(chatLog);
        kafkaChatMessageProducerService.sendMessage(message);
    }

    public void addUserToChat(ChatMessage chatMessage) {
        String messageLogId = chatMessage.getMessageLogId();
        String username = chatMessage.getSender();

        ChatRoom chatRoom = chatRoomRepository.findById(messageLogId)
                .orElse(new ChatRoom(messageLogId,
                        "Chatroom " + messageLogId,
                        ChatRoom.ChatRoomType.GROUP,
                        new ArrayList<>()));
        chatRoom.addMember(username);
        chatRoomRepository.save(chatRoom);
        kafkaChatMessageProducerService.sendMessage(chatMessage);
    }
}
