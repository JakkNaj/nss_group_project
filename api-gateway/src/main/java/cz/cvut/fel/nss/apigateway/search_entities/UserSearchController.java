package cz.cvut.fel.nss.apigateway.search_entities;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_management.entities.dto.UserEntityDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/searchEntities")
public class UserSearchController {

    LoggingClient loggingClient = new LoggingClient("api-gateway");

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping
    public ResponseEntity<List<UserEntityDto>> searchUser(@RequestParam("username") String username, @RequestParam("page") int page) {

        String url = ServiceEnum.SEARCH_ENTITIES.getUrl() + "/searchEntities?username=" + username + "&page=" + page;

        ResponseEntity<List<UserEntityDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<UserEntityDto>>() {}
        );

        List<UserEntityDto> userEntities = response.getBody();
        loggingClient.logInfo("retrieved list of users: " + userEntities);
        return ResponseEntity.status(response.getStatusCode()).body(userEntities);
    }


}
