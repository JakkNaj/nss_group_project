package cz.cvut.fel.nss.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGateWayApplication {

//    @Bean
//    public RestTemplateBuilder getRestTemplateBuilder() {
//        return new RestTemplateBuilder();
//    }

    public static void main(String[] args) {
        SpringApplication.run(ApiGateWayApplication.class, args);
    }

}
