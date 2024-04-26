package cz.cvut.fel.global_logging;

import cz.cvut.fel.global_logging.entity.LevelEnum;
import cz.cvut.fel.global_logging.entity.LogEntity;
import org.springframework.web.client.RestTemplate;

public class LoggingClient {
    private final RestTemplate restTemplate;
    private final String sourceComponent;

    public LoggingClient(String sourceComponent) {
        this.restTemplate = new RestTemplate();
        this.sourceComponent = sourceComponent;
    }

    public void logInfo(String message) {
        LogEntity logEntity = LogEntity.builder()
            .sourceComponent(sourceComponent)
            .level(LevelEnum.INFO)
            .message(message)
            .timestamp(System.currentTimeMillis())
            .build();
        restTemplate.postForEntity("http://localhost:8083/log", logEntity, LogEntity.class);
    }

    public void logError(String message) {
        LogEntity logEntity = LogEntity.builder()
            .sourceComponent(sourceComponent)
            .level(LevelEnum.ERROR)
            .message(message)
            .timestamp(System.currentTimeMillis())
            .build();
        restTemplate.postForEntity("http://localhost:8083/log", logEntity, LogEntity.class);
    }

    public void logWarning(String message) {
        LogEntity logEntity = LogEntity.builder()
            .sourceComponent(sourceComponent)
            .level(LevelEnum.WARN)
            .message(message)
            .timestamp(System.currentTimeMillis())
            .build();
        restTemplate.postForEntity("http://localhost:8083/log", logEntity, LogEntity.class);
    }

    public void logDebug(String message) {
        LogEntity logEntity = LogEntity.builder()
            .sourceComponent(sourceComponent)
            .level(LevelEnum.DEBUG)
            .message(message)
            .timestamp(System.currentTimeMillis())
            .build();
        restTemplate.postForEntity("http://localhost:8083/log", logEntity, LogEntity.class);
    }
}
