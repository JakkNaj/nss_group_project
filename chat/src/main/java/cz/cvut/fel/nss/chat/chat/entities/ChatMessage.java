package cz.cvut.fel.nss.chat.chat.entities;

import cz.cvut.fel.nss.chat.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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
@Slf4j
public class ChatMessage implements Comparable<ChatMessage> {
    @Id
    private String id;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private Integer messageLogId;
    @Field(type = FieldType.Text, includeInParent = true)
    private String content;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private Integer senderId;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private MessageType type;
    @Field(type = FieldType.Long, includeInParent = true)
    private long timestampInSeconds;
    @Field(type = FieldType.Nested, includeInParent = true)
    private MessageReference messageReference;

    public ChatMessage(JSONObject jsonObject) {
        try {
            this.id = jsonObject.getString("id");
            this.messageLogId = jsonObject.getInt("messageLogId");
            this.content = jsonObject.getString("content");
            this.senderId = jsonObject.getInt("senderId");
            this.type = MessageType.valueOf(jsonObject.getString("type"));
            this.timestampInSeconds = jsonObject.getLong("timestampInSeconds");
            if (jsonObject.has("messageReference") && !jsonObject.isNull("messageReference")) {
                this.messageReference = new MessageReference(jsonObject.getJSONObject("messageReference"));
            } else {
                this.messageReference = null;
            }
        } catch (JSONException e) {
            throw new RuntimeException("Issue making ChatMessage from JSON", e);
        }
    }

    public ChatMessageDto toDto() {
        log.info("Converting ChatMessage to ChatMessageDto \n" + this);
        return new ChatMessageDto(id, messageLogId, content, senderId, type, timestampInSeconds, messageReference);
    }

    @Override
    public int compareTo(@NotNull ChatMessage o) {
        return 0;
    }

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        REPLY
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id='" + id + '\'' +
                ", messageLogId=" + messageLogId +
                ", content='" + content + '\'' +
                ", senderId=" + senderId +
                ", type=" + type +
                ", timestampInSeconds=" + timestampInSeconds +
                ", messageReference=" + messageReference +
                '}';
    }
}
