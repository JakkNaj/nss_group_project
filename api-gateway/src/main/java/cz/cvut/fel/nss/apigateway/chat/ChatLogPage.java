package cz.cvut.fel.nss.apigateway.chat;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import cz.cvut.fel.nss.chat.chat.entities.ChatLog;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatLogPage extends PageImpl<ChatLog> {

    @JsonCreator
    public ChatLogPage(@JsonProperty("content") List<ChatLog> content,
                       @JsonProperty("number") int number,
                       @JsonProperty("size") int size,
                       @JsonProperty("totalElements") long totalElements,
                       @JsonProperty("pageable") Object pageable,
                       @JsonProperty("last") boolean last,
                       @JsonProperty("totalPages") int totalPages,
                       @JsonProperty("sort") Object sort,
                       @JsonProperty("first") boolean first,
                       @JsonProperty("numberOfElements") int numberOfElements) {
        super(content, PageRequest.of(number, size), totalElements);
    }

    public boolean isEmpty() {
        return getNumberOfElements() == 0;
    }

}