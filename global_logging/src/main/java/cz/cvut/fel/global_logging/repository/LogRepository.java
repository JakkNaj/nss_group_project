package cz.cvut.fel.global_logging.repository;

import cz.cvut.fel.global_logging.entity.LevelEnum;
import cz.cvut.fel.global_logging.entity.LogEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

@Repository
public interface LogRepository extends ElasticsearchRepository<LogEntity, Long>{
    List<LogEntity> findBySourceComponent(String sourceComponent);
    List<LogEntity> findByLevel(LevelEnum level);
    List<LogEntity> findByTimestamp(long timestamp);

}
