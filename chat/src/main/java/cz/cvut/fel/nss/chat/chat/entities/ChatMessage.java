package cz.cvut.fel.nss.chat.chat.entities;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = "chat-messages")
public class ChatMessage {
    @Id
    private String id;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private String messageLogId;
    @Field(type = FieldType.Text, includeInParent = true)
    private String content;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private String sender;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private MessageType type;
    @Field(type = FieldType.Long, includeInParent = true)
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

    public ChatMessageDto toDto() {
        return new ChatMessageDto(id, content, sender, type, timestampInSeconds);
    }

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
