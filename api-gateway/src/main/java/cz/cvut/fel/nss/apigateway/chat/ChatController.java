package cz.cvut.fel.nss.apigateway.chat;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/chat-history")
@PreAuthorize("hasRole('ROLE_USER')")
public class ChatController {

    LoggingClient loggingClient = new LoggingClient("api-gateway");

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/chatLogsForUser")
    public ResponseEntity<ChatLogPage> getChatHistoryForUser(@RequestParam("userId") Integer userId, @RequestParam(defaultValue = "0") int page) {
        String url = ServiceEnum.CHAT.getUrl() + "/chat-history/chatLogsForUser?userId=" + userId + "&page=" + page;

        var response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ChatLogPage>() {}
        );

        loggingClient.logInfo("Retrieved list of chat logs for user: " + userId + " - " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/chatRoom")
    public ResponseEntity<List<ChatRoom>> getChatRoomsForUser(@RequestParam("userId") Integer userId, @RequestParam(defaultValue = "0") int page) {
        String url = ServiceEnum.CHAT.getUrl() + "/chat-history/chatRoom?userId=" + userId + "&page=" + page;

        ResponseEntity<List<ChatRoom>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<ChatRoom> chatRooms = response.getBody();
        loggingClient.logInfo("Retrieved list of chat rooms for user: " + chatRooms);
        return ResponseEntity.status(response.getStatusCode()).body(chatRooms);
    }

    @GetMapping("/chatRoom/{chatRoomId}")
    public ResponseEntity<ChatRoom> getChatRoomById(@PathVariable("chatRoomId") Integer chatRoomId) {
        String url = ServiceEnum.CHAT.getUrl() + "/chat-history/chatRoom/" + chatRoomId;
        ResponseEntity<ChatRoom> response = restTemplate.getForEntity(url, ChatRoom.class);
        loggingClient.logInfo("retrieved chatRoom: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/chatLog")
    public ResponseEntity<ChatLog> getChatHistory(@RequestParam("chatLogId") String chatLogId, @RequestParam int page) {
        String url = ServiceEnum.CHAT.getUrl() + "/chat-history/chatLog?chatLogId=" + chatLogId + "&page=" + page;
        ResponseEntity<ChatLog> response = restTemplate.getForEntity(url, ChatLog.class);
        loggingClient.logInfo("retrieved chatLog: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }


    //chatController
    @PostMapping("/addUserToChat")
    public ResponseEntity<ChatRoom> addUser(@RequestBody ChatMessage chatMessage) {
        String url = ServiceEnum.CHAT.getUrl() + "/chat-history/addUserToChat?chatMessage=" + chatMessage;
        ResponseEntity<ChatRoom> response = restTemplate.postForEntity(url, null, ChatRoom.class);
        loggingClient.logInfo("Added user to chat room: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
