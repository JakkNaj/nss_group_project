package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.services.ChatHistoryService;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.config.ChatConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("chat-history")
public class ChatHistoryController {
    private final ChatHistoryService chatHistoryService;
    private final ChatConfig chatConfig;

    @Autowired
    public ChatHistoryController(ChatHistoryService chatHistoryService, ChatConfig chatConfig) {
        this.chatHistoryService = chatHistoryService;
        this.chatConfig = chatConfig;
    }

    @GetMapping("/chatLog")
    public List<ChatLog> getChatHistoryForUser(@RequestParam("userId") Integer userId) {
        return chatHistoryService.getChatHistoryForUser(userId);
    }

    @GetMapping("/chatRoom")
    public List<ChatRoom> getChatRoomsForUser(
            @RequestParam("userId") Integer userId,
            @RequestParam int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, chatConfig.getPageSize());
        return chatHistoryService.getChatRoomsForUser(userId, pageRequest);
    }

    @GetMapping("/chatLog")
    public ChatLog getChatHistory(
        @RequestParam("chatLogId") Integer chatId,
        @RequestParam int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, chatConfig.getPageSize());
        return chatHistoryService.getChatHistory(chatId, pageRequest);
    }
}
