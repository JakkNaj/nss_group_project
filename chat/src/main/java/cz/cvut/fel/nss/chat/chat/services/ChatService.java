package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.exception.BadRequestException;
import cz.cvut.fel.nss.chat.chat.exception.NotFoundException;
import cz.cvut.fel.nss.chat.chat.repositories.ChatMessageRepository;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;

    private final KafkaChatMessageProducerService kafkaChatMessageProducerService;
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatService(ChatRoomRepository chatRoomRepository, KafkaChatMessageProducerService kafkaChatMessageProducerService, ChatMessageRepository chatMessageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.kafkaChatMessageProducerService = kafkaChatMessageProducerService;
        this.chatMessageRepository = chatMessageRepository;
    }

    public void saveAndSendMessage(ChatMessage message) {
        log.trace("Saving message {}", message);
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(message.getMessageLogId());

        if (optionalChatRoom.isEmpty()) {
            log.warn("Chatroom {} does not exist", message.getMessageLogId());
            throw new NotFoundException("Chatroom " + message.getMessageLogId() + " does not exist");
        }

        if (!optionalChatRoom.get().getMembers().contains(message.getSenderId())) {
            log.warn("User {} is not a member of chatroom {}", message.getSenderId(), message.getMessageLogId());
            throw new BadRequestException("User " + message.getSenderId() + " is not a member of chatroom " + message.getMessageLogId());
        }

        message.setId(UUID.randomUUID().toString());

        kafkaChatMessageProducerService.sendMessage(message);

        optionalChatRoom
                .get()
                .setLastMessageTimestamp(message.getTimestampInSeconds());
        chatRoomRepository.save(optionalChatRoom.get());
        chatMessageRepository.save(message);
    }

    public ChatRoom addUserToChat(ChatMessage chatMessage) {
        log.trace("Adding user {} to chatroom {}", chatMessage.getSenderId(), chatMessage.getMessageLogId());
        Integer messageLogId = chatMessage.getMessageLogId();
        Integer senderId = chatMessage.getSenderId();

        ChatRoom chatRoom = chatRoomRepository.findById(messageLogId)
                .orElse(new ChatRoom(messageLogId,
                        "Chatroom " + messageLogId,
                        ChatRoom.ChatRoomType.GROUP,
                        new ArrayList<>(),
                        chatMessage.getTimestampInSeconds()
                    )
                );

        chatMessage.setId(UUID.randomUUID().toString());


        kafkaChatMessageProducerService.sendMessage(chatMessage);

        chatRoom.setLastMessageTimestamp(chatMessage.getTimestampInSeconds());
        if (!chatRoom.getMembers().contains(senderId)) {
            log.trace("Adding user {} to chatroom {}", senderId, messageLogId);
            chatRoom.addMember(senderId);
            chatRoomRepository.save(chatRoom);
        }

        return chatRoom;
    }
}
