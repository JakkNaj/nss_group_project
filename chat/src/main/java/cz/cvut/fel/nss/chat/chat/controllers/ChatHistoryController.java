package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.nss.chat.chat.services.ChatHistoryService;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/chat")
public class ChatHistoryController {
    @Autowired
    private ChatHistoryService chatHistoryService;

    @GetMapping("/getChatHistory")
    public ChatLog getChatHistory(@RequestParam("chatId") String chatId) {
        return chatHistoryService.getChatHistory(chatId);
    }

    @GetMapping("/getChatHistoryForUser")
    public List<ChatLog> getChatHistoryForUser(@RequestParam("username") String username) {
        return chatHistoryService.getChatHistoryForUser(username);
    }
}
