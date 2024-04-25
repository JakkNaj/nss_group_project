package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.exception.BadRequestException;
import cz.cvut.fel.nss.chat.chat.repositories.ChatMessageRepository;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public void saveMessage(ChatMessage message) {
        log.trace("Saving message {}", message);
        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findById(message.getMessageLogId());
        if (optionalChatRoom.isEmpty()) {
            optionalChatRoom =
                    Optional.of(
                            new ChatRoom(
                                    message.getMessageLogId(),
                                    "Chatroom " + message.getMessageLogId(),
                                    ChatRoom.ChatRoomType.GROUP,
                                    List.of(message.getSender()
                                    )
                            )
                    );
            chatRoomRepository.save(optionalChatRoom.get());
        }

        if (!optionalChatRoom.get().getMembers().contains(message.getSender())) {
            log.warn("User {} is not a member of chatroom {}", message.getSender(), message.getMessageLogId());
            throw new BadRequestException("User" + message.getSender() + " is not a member of chatroom " + message.getMessageLogId());
        }
        chatMessageRepository.save(message);
        kafkaChatMessageProducerService.sendMessage(message);
    }

    public void addUserToChat(ChatMessage chatMessage) {
        log.trace("Adding user {} to chatroom {}", chatMessage.getSender(), chatMessage.getMessageLogId());
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
