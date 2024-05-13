package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.config.KafkaConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaChatMessageProducerService {

    private final KafkaConfiguration kafkaConfiguration;
    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public KafkaChatMessageProducerService(KafkaConfiguration kafkaConfiguration, KafkaTemplate<String, ChatMessage> kafkaTemplate) {
        this.kafkaConfiguration = kafkaConfiguration;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(ChatMessage message) {
        log.info("Sending message to Kafka: {}", message);
        kafkaTemplate.send(kafkaConfiguration.getDefaultTopic(), message);
    }
}