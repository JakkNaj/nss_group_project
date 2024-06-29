package cz.cvut.fel.nss.chat.chat.entities;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatLog {
    private Integer chatLogId;
    private List<ChatMessageDto> messages;

    @Override
    public String toString() {
        return "ChatLog{" +
                "chatLogId=" + chatLogId +
                ", messages=" + messages +
                '}';
    }
}
