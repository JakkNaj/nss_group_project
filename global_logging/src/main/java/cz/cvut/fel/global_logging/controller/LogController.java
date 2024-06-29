package cz.cvut.fel.global_logging.controller;

import cz.cvut.fel.global_logging.entity.LevelEnum;
import cz.cvut.fel.global_logging.entity.LogEntity;
import cz.cvut.fel.global_logging.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/log")
public class LogController {

    private final LogService logService;

    @Autowired
    public LogController(LogService logService) {
        this.logService = logService;
    }

    @PostMapping
    public ResponseEntity<Void> saveLog(@RequestBody LogEntity logEntity) {
        logService.saveLog(logEntity);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Iterable<LogEntity>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    @GetMapping("/source")
    public ResponseEntity<Iterable<LogEntity>> getLogsBySourceComponent(@RequestParam String sourceComponent) {
        return ResponseEntity.ok(logService.getLogsBySourceComponent(sourceComponent));
    }

    @GetMapping("/level")
    public ResponseEntity<Iterable<LogEntity>> getLogsByLevel(@RequestParam LevelEnum level) {
        return ResponseEntity.ok(logService.getLogsByLevel(level));
    }

    @GetMapping("/timestamp")
    public ResponseEntity<Iterable<LogEntity>> getLogsByTimestamp(@RequestParam long timestamp) {
        return ResponseEntity.ok(logService.getLogsByTimestamp(timestamp));
    }
}
