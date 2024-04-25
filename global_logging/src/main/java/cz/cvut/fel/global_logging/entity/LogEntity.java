package cz.cvut.fel.global_logging.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = "log-message")
public class LogEntity {
    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String sourceComponent;

    @Field(type = FieldType.Keyword)
    private LevelEnum level;

    @Field(type = FieldType.Text)
    private String message;

    @Field(type = FieldType.Long)
    private long timestamp;

}
