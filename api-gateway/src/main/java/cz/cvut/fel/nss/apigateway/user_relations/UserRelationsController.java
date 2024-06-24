package cz.cvut.fel.nss.apigateway.user_relations;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class UserRelationsController {
    RestTemplate restTemplate;
    LoggingClient loggingClient = new LoggingClient("api-gateway");

    @Autowired
    public UserRelationsController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/block/{blockedId}")
    public ResponseEntity<Void> blockUser(@PathVariable int blockedId){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/block/" + blockedId;
        restTemplate.postForEntity(url, null, Void.class);
        loggingClient.logInfo("User " + blockedId + " blocked");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/block/{blockedId}")
    public ResponseEntity<Void> unblockUser(@PathVariable int blockedId){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/block/" + blockedId;
        restTemplate.delete(url);
        loggingClient.logInfo("User " + blockedId + " unblocked");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Integer>> getAllFriends(@PathVariable int userId) {
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friends/" + userId;
        ResponseEntity<List<Integer>> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.GET,
                null,
                new org.springframework.core.ParameterizedTypeReference<>() {
                }
        );
        List<Integer> friends = response.getBody();
        loggingClient.logInfo("retrieved list of friends: " + friends);
        return ResponseEntity.status(response.getStatusCode()).body(friends);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> removeFriend(@PathVariable int userId){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friends/" + userId;
        restTemplate.delete(url);
        loggingClient.logInfo("Friend " + userId + " removed");
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/friendRequest/{userId}")
    public ResponseEntity<List<FriendRequest>> getAllFriendRequests(
            @PathVariable int userId
    ){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friendRequest/" + userId;
        ResponseEntity<List<FriendRequest>> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.GET,
                null,
                new org.springframework.core.ParameterizedTypeReference<>() {
                }
        );
        List<FriendRequest> friendRequests = response.getBody();
        loggingClient.logInfo("retrieved list of friend requests: " + friendRequests);
        return ResponseEntity.status(response.getStatusCode()).body(friendRequests);
    }


    @PostMapping("/friendRequest/{recipientId}")
    public ResponseEntity<String> sendFriendRequest(
            @PathVariable int recipientId
    ){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friendRequest/" + recipientId;
        restTemplate.postForEntity(url, null, String.class);
        loggingClient.logInfo("Friend request sent to " + recipientId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friendRequest/accept/{senderId}")
    public ResponseEntity<String> acceptFriendRequest(
            @PathVariable int senderId
    ){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friendRequest/accept/" + senderId;
        restTemplate.postForEntity(url, null, String.class);
        loggingClient.logInfo("Friend request from " + senderId + " accepted");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friendRequest/decline/{senderId}")
    public ResponseEntity<String> declineFriendRequest(
            @PathVariable int senderId
    ){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friendRequest/decline/" + senderId;
        restTemplate.postForEntity(url, null, String.class);
        loggingClient.logInfo("Friend request from " + senderId + " declined");
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/friendRequest/delete/{recipientId}")
    public ResponseEntity<String> deleteFriendRequest(
            @PathVariable int recipientId
    ){
        String url = ServiceEnum.USER_RELATIONS.getUrl() + "/friendRequest/delete/" + recipientId;
        restTemplate.delete(url);
        loggingClient.logInfo("Friend request to " + recipientId + " deleted");
        return ResponseEntity.noContent().build();
    }
}
