package cz.cvut.fel.nss.chat.chat.dto;

import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.chat.entities.MessageReference;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ChatMessageDto {
    private String id;
    private String content;
    private Integer senderId;
    private ChatMessage.MessageType type;
    private long timestampInSeconds;
    private MessageReference messageReference;
}
