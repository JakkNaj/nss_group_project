package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;

    private final KafkaChatMessageProducerService kafkaChatMessageProducerService;
    @Autowired
    public ChatService(ChatRoomRepository chatRoomRepository, KafkaChatMessageProducerService kafkaChatMessageProducerService) {
        this.chatRoomRepository = chatRoomRepository;
        this.kafkaChatMessageProducerService = kafkaChatMessageProducerService;
    }

    public void saveMessage(ChatMessage message) {
        ChatRoom chatRoom = chatRoomRepository.findById(message.getMessageLogId())
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        kafkaChatMessageProducerService.sendMessage(message);

        chatRoom.getChatLog().addMessage(message);
        log.info("Chat log: {}", chatRoom.getChatLog());
        chatRoomRepository.save(chatRoom);
    }

    public void addUserToChat(ChatMessage chatMessage) {
        String messageLogId = chatMessage.getMessageLogId();
        String username = chatMessage.getSender();

        ChatRoom chatRoom = chatRoomRepository.findById(messageLogId)
                .orElse(new ChatRoom(chatMessage.getMessageLogId()));
        chatRoom.addMember(username);
        chatRoomRepository.save(chatRoom);
        kafkaChatMessageProducerService.sendMessage(chatMessage);
    }
}
