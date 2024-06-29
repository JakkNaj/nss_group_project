package cz.cvut.fel.nss.apigateway.user_management;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.io.InputStream;

public class ChannelInputStreamSerializer extends JsonSerializer<InputStream> {

    @Override
    public void serialize(InputStream value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        byte[] bytes = value.readAllBytes();
        gen.writeBinary(bytes);
    }
}
