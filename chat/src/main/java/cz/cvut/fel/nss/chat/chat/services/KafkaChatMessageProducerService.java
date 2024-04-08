package cz.cvut.fel.nss.chat.chat.services;

import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import cz.cvut.fel.nss.chat.config.KafkaConfiguration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaChatMessageProducerService {

    private final KafkaConfiguration kafkaConfiguration;
    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public KafkaChatMessageProducerService(KafkaConfiguration kafkaConfiguration, KafkaTemplate<String, ChatMessage> kafkaTemplate) {
        this.kafkaConfiguration = kafkaConfiguration;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(ChatMessage message) {
        kafkaTemplate.send(kafkaConfiguration.getDefaultTopic(), message);
    }
}