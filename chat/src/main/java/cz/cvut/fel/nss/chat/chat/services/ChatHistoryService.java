package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.repositories.ChatMessageRepository;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import cz.cvut.fel.nss.chat.config.ChatConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
public class ChatHistoryService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatConfig chatConfig;

    @Autowired
    public ChatHistoryService(
            ChatMessageRepository chatMessageRepository,
            ChatRoomRepository chatRoomRepository, ChatConfig chatConfig) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatConfig = chatConfig;
    }

    public ChatLog getChatHistory(Integer chatId, Pageable pageable) {
        log.trace("Getting chat history for chatId={}", chatId);
        List<ChatMessageDto> chatMessages = chatMessageRepository
                .findAllByMessageLogIdOrderByTimestampInSecondsDesc(chatId, pageable)
                .stream()
                .sorted()
                .map(ChatMessage::toDto)
                .toList();
        return new ChatLog(chatId, chatMessages);
    }

    public List<ChatLog> getChatHistoryForUser(Integer userId) {
        log.trace("Getting chat history for userId={}", userId);

        PageRequest pageRequest = PageRequest.of(0, chatConfig.getPageSize());

        List<Integer> chatIds = chatRoomRepository.findAllByMembersContainingOrderByLastMessageTimestampDesc(userId, pageRequest)
                .stream()
                .map(ChatRoom::getChatLogId)
                .toList();

        log.trace("Found chatIds={}", chatIds);

        return chatIds.stream()
                .map(chatId -> getChatHistory(chatId, pageRequest))
                .toList();
    }

    public List<ChatRoom> getChatRoomsForUser(Integer userId, Pageable pageable) {
        log.trace("Getting chat rooms for userId={}", userId);
        return chatRoomRepository
                .findAllByMembersContainingOrderByLastMessageTimestampDesc(userId, pageable)
                .toList();
    }
}
