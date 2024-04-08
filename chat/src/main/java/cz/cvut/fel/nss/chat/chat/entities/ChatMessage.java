package cz.cvut.fel.nss.chat.chat.entities;

import lombok.*;
import org.json.JSONException;
import org.json.JSONObject;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String messageLogId;
    private String content;
    private String sender;
    private MessageType type;
    private long timestampInSeconds;

    public ChatMessage(JSONObject jsonObject) {
        try {
            this.messageLogId = jsonObject.getString("messageLogId");
            this.content = jsonObject.getString("content");
            this.sender = jsonObject.getString("sender");
            this.type = MessageType.valueOf(jsonObject.getString("type"));
            this.timestampInSeconds = jsonObject.getLong("timestampInSeconds");
        } catch (JSONException e) {
            throw new RuntimeException("Issue making ChatMessage from JSON", e);
        }
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "messageLogId='" + messageLogId + '\'' +
                ", content='" + content + '\'' +
                ", sender='" + sender + '\'' +
                ", type=" + type +
                ", timestampInSeconds=" + timestampInSeconds +
                '}';
    }

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
