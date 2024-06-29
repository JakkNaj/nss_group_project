package cz.cvut.fel.nss.chat.chat.controllers;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import cz.cvut.fel.nss.chat.chat.services.ChatHistoryService;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.config.ChatConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("chat-history")
@Slf4j
public class ChatHistoryController {
    LoggingClient loggingClient = new LoggingClient("chat");

    private final ChatHistoryService chatHistoryService;
    private final ChatConfig chatConfig;

    @Autowired
    public ChatHistoryController(ChatHistoryService chatHistoryService, ChatConfig chatConfig) {
        this.chatHistoryService = chatHistoryService;
        this.chatConfig = chatConfig;
    }

    @GetMapping("/chatLogsForUser")
    public Page<ChatLog> getChatHistoryForUser(
            @RequestParam("userId") Integer userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, chatConfig.getPageSize());
        Page<ChatLog> chatHistoryForUser = chatHistoryService.getChatHistoryForUser(userId, pageRequest);
        loggingClient.logInfo("retrieved list of chat logs of user: " + userId);
        log.info("retrieved list of chat logs of user: " + chatHistoryForUser.getContent().toString());
        return chatHistoryForUser;
    }

    @GetMapping("/chatRoom")
    public List<ChatRoom> getChatRoomsForUser(
            @RequestParam("userId") Integer userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, chatConfig.getPageSize());
        loggingClient.logInfo("retrieved list of chatrooms of user: " + chatHistoryService.getChatRoomsForUser(userId, pageRequest));
        return chatHistoryService.getChatRoomsForUser(userId, pageRequest);
    }

    @GetMapping("/chatRoom/{chatRoomId}")
    public ChatRoom getChatRoomById(@PathVariable("chatRoomId") Integer chatRoomId) {
        loggingClient.logInfo("retrieved chatRoom: " +chatHistoryService.getChatRoomById(chatRoomId));
        return chatHistoryService.getChatRoomById(chatRoomId);
    }

    @GetMapping("/chatLog")
    public ChatLog getChatHistory(
        @RequestParam("chatLogId") Integer chatId,
        @RequestParam int page
    ) {
        PageRequest pageRequest = PageRequest.of(page, chatConfig.getPageSize());
        loggingClient.logInfo("retrieved chatLog: " + chatHistoryService.getChatHistory(chatId, pageRequest));
        return chatHistoryService.getChatHistory(chatId, pageRequest);
    }
}
