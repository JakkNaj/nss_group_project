package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.repositories.ChatMessageRepository;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
public class ChatHistoryService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatHistoryService(
            ChatMessageRepository chatMessageRepository,
            ChatRoomRepository chatRoomRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatLog getChatHistory(Integer chatId) {
        log.trace("Getting chat history for chatId={}", chatId);
        List<ChatMessageDto> chatMessages = chatMessageRepository
                .findAllByMessageLogIdOrderByTimestampInSeconds(chatId)
                .stream()
                .map(ChatMessage::toDto)
                .toList();
        return new ChatLog(chatId, chatMessages);
    }

    public List<ChatLog> getChatHistoryForUser(Integer userId) {
        log.trace("Getting chat history for userId={}", userId);
        List<Integer> chatIds = chatRoomRepository.findAllByMembersContaining(userId)
                .stream()
                .map(ChatRoom::getChatLogId)
                .toList();
        return chatIds.stream()
                .map(this::getChatHistory)
                .toList();
    }

    public List<ChatRoom> getChatRoomsForUser(Integer userId) {
        log.trace("Getting chat rooms for userId={}", userId);
        return chatRoomRepository.findAllByMembersContaining(userId);
    }
}
