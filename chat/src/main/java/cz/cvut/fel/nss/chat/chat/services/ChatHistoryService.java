package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.repositories.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatHistoryService {
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatHistoryService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatLog getChatHistory(String chatId) {
        return chatRoomRepository.findById(chatId).orElse(new ChatRoom()).getChatLog();
    }

    public List<ChatLog> getChatHistoryForUser(String username) {
        return chatRoomRepository.findByMembersContaining(username).stream()
                .map(ChatRoom::getChatLog)
                .collect(Collectors.toList());
    }
}
