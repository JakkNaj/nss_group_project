package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.repositories.ChatLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatHistoryService {
    @Autowired
    private ChatLogRepository chatLogRepository;

    public ChatLog getChatHistory(String chatId) {
        return chatLogRepository.findById(chatId).orElse(new ChatLog());
    }
}
