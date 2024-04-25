package cz.cvut.fel.nss.chat.chat.dto;

import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@AllArgsConstructor
@Getter
public class ChatMessageDto {
    @Id
    private String id;
    @Field(type = FieldType.Text, includeInParent = true)
    private String content;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private String sender;
    @Field(type = FieldType.Keyword, includeInParent = true)
    private ChatMessage.MessageType type;
    @Field(type = FieldType.Long, includeInParent = true)
    private long timestampInSeconds;
}
