package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.nss.chat.chat.services.ChatHistoryService;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("chat-history")
public class ChatHistoryController {
    @Autowired
    private ChatHistoryService chatHistoryService;

    @GetMapping
    public ChatLog getChatHistory(@RequestParam("chatId") String chatId) {
        return chatHistoryService.getChatHistory(chatId);
    }

    @GetMapping("/deleteForTesting")
    public void deleteAll() {
        chatHistoryService.deleteAll();
    }
}
