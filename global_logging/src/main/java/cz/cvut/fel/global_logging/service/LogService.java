package cz.cvut.fel.global_logging.service;

import cz.cvut.fel.global_logging.entity.LevelEnum;
import cz.cvut.fel.global_logging.entity.LogEntity;
import cz.cvut.fel.global_logging.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    private final LogRepository logRepository;

    @Autowired
    public LogService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void saveLog(LogEntity logEntity) {
        logRepository.save(logEntity);
    }

    public Iterable<LogEntity> getAllLogs() {
        return logRepository.findAll();
    }

    public List<LogEntity> getLogsBySourceComponent(String sourceComponent) {
        return logRepository.findBySourceComponent(sourceComponent);
    }

    public List<LogEntity> getLogsByLevel(LevelEnum level) {
        return logRepository.findByLevel(level);
    }

    public List<LogEntity> getLogsByTimestamp(long timestamp) {
        return logRepository.findByTimestamp(timestamp);
    }


}
