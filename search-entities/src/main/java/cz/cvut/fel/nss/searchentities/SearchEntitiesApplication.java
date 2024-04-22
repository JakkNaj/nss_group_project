package cz.cvut.fel.nss.searchentities;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EntityScan("cz.cvut.fel.nss.user_management.entities")
@EnableCaching
public class SearchEntitiesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SearchEntitiesApplication.class, args);
    }

}
