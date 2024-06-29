package cz.cvut.fel.nss.apigateway.user_management;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addSerializer(InputStream.class, new ChannelInputStreamSerializer());
        mapper.registerModule(module);
        return mapper;
    }
}
