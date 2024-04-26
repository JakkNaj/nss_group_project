package cz.cvut.fel.nss.chat.chat.repositories;

import cz.cvut.fel.nss.chat.chat.entities.ChatMessage;
import org.springframework.data.elasticsearch.annotations.Highlight;
import org.springframework.data.elasticsearch.annotations.HighlightField;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends ElasticsearchRepository<ChatMessage, String> {
    @Highlight(fields = {
            @HighlightField(name = "content")
    })
    List<ChatMessage> findAllByMessageLogIdOrderByTimestampInSeconds(Integer messageLogId);
}
