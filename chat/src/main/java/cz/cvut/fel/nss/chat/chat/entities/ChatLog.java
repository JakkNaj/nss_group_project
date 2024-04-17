package cz.cvut.fel.nss.chat.chat.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class ChatLog {
    private List<ChatMessage> messages;

    public void addMessage(ChatMessage message) {
        if (messages == null) {
            messages = new ArrayList<>();
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
