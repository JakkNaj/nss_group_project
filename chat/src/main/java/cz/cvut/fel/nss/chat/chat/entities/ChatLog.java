package cz.cvut.fel.nss.chat.chat.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "chatLog")
@Getter
@NoArgsConstructor
public class ChatLog {
    @Id
    private String id;
    private List<ChatMessage> messages;

    public void addMessage(ChatMessage message) {
        if (messages == null) {
            messages = new ArrayList<>();
            id = message.getMessageLogId();
        }
        messages.add(message);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (ChatMessage message : messages) {
            sb.append(message.toString()).append("\n");
        }
        return sb.toString();
    }
}
