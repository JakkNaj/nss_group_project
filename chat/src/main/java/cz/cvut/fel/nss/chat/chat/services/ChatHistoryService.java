package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.repositories.ChatMessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Slf4j
public class ChatHistoryService {
    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatHistoryService(
            ChatMessageRepository chatMessageRepository
    ) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatLog getChatHistory(String chatId) {
        log.trace("Getting chat history for chatId={}", chatId);
        List<ChatMessageDto> chatMessages = chatMessageRepository
                .findAllByMessageLogIdOrderByTimestampInSeconds(chatId)
                .stream()
                .map(ChatMessage::toDto)
                .toList();
        return new ChatLog(chatId, chatMessages);
    }


    //for reference for search messages component
    public List<ChatMessage> searchChatHistoryByContent(String messageLogId, String content) {
        return chatMessageRepository.findAllByMessageLogIdAndContentIsLikeIgnoreCase(messageLogId, content);
    }
}
