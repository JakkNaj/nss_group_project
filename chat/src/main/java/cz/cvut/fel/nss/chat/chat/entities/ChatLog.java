package cz.cvut.fel.nss.chat.chat.entities;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ChatLog {
    private Integer chatLogId;
    private List<ChatMessageDto> messages;
}
