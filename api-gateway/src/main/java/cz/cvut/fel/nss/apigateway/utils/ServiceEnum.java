package cz.cvut.fel.nss.apigateway.utils;

import lombok.Getter;

@Getter
public enum ServiceEnum {
    CHAT("http://localhost:8080"),
    USER_MANAGEMENT("http://localhost:8081"),
    SEARCH_ENTITIES("http://localhost:8084"),
    USER_RELATIONS("http://localhost:8082");

    private final String url;

    ServiceEnum(String url) {
        this.url = url;
    }
}
