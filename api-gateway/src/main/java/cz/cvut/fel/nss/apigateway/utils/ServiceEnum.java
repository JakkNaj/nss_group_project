package cz.cvut.fel.nss.apigateway.utils;

import lombok.Getter;

@Getter
public enum ServiceEnum {
    //todo: use this enum in the api-gateway rest controllers
    CHAT("http://localhost:8080"),
    USER_MANAGEMENT("http://localhost:8081"),
    SEARCH_ENTITIES("http://localhost:8084");

    private final String url;

    ServiceEnum(String url) {
        this.url = url;
    }
}
