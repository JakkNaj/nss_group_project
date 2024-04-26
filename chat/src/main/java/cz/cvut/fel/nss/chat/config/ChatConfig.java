package cz.cvut.fel.nss.chat.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class ChatConfig {
    @Value("${chat.page.size}")
    private int pageSize;
}
