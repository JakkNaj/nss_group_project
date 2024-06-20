package cz.cvut.fel.nss.user_relations.controller;

import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import cz.cvut.fel.nss.user_relations.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/friendRequest")
public class FriendRequestController {
    @Autowired
    FriendRequestService friendRequestService;

    @GetMapping("/{username}")
    public ResponseEntity<List<FriendRequest>> getAllFriendRequests(
            @PathVariable String username
    ){
        List<FriendRequest> friendRequests = friendRequestService.getAllFriendRequestsForRecipient(username);
        return ResponseEntity.ok(friendRequests);
    }


    @PostMapping("/{sender}/{recipient}")
    public ResponseEntity<String> sendFriendRequest(
            @PathVariable String recipient,
            @PathVariable String sender //// todo sender je Principal.getUsername()
    ){
        friendRequestService.sendFriendRequest(sender, recipient);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept/{sender}/{recipient}")
    public ResponseEntity<String> acceptFriendRequest(
            @PathVariable String sender,
            @PathVariable String recipient //// todo recipient je Principal.getUsername()
    ){
        friendRequestService.acceptFriendRequest(sender, recipient);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline/{sender}/{recipient}")
    public ResponseEntity<String> declineFriendRequest(
            @PathVariable String sender,
            @PathVariable String recipient //// todo recipient je Principal.getUsername()
    ){
        friendRequestService.declineFriendRequest(sender, recipient);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{recipient}")
    public ResponseEntity<String> deleteFriendRequest(
            @PathVariable String recipient,
            String sender ////sender je Principal.getUsername()
    ){
        friendRequestService.deleteFriendRequest(sender, recipient);
        return ResponseEntity.noContent().build();
    }
}
