package cz.cvut.fel.nss.chat.chat.entities;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serializer;


@Slf4j
public class ChatMessageSerializer implements Serializer<ChatMessage> {
    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public byte[] serialize(String topic, ChatMessage data) {
        try {
            log.info("Serializing ChatMessage to JSON: {}", data);
            return objectMapper.writeValueAsBytes(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing ChatMessage to JSON", e);
        }
    }
}
