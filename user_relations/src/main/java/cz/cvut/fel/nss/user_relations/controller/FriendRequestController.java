package cz.cvut.fel.nss.user_relations.controller;

import cz.cvut.fel.nss.user_relations.entity.FriendRequest;
import cz.cvut.fel.nss.user_relations.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/friendRequest")
public class FriendRequestController {
    @Autowired
    FriendRequestService friendRequestService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<FriendRequest>> getAllFriendRequests(
            @PathVariable int userId
    ){
        List<FriendRequest> friendRequests = friendRequestService.getAllFriendRequestsForRecipient(userId);
        return ResponseEntity.ok(friendRequests);
    }


    @PostMapping("/{recipientId}")
    public ResponseEntity<String> sendFriendRequest(
            @PathVariable int recipientId
    ){
        friendRequestService.sendFriendRequestToUserId(recipientId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept/{senderId}")
    public ResponseEntity<String> acceptFriendRequest(
            @PathVariable int senderId
    ){
        friendRequestService.acceptFriendRequestFromUserId(senderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline/{senderId}")
    public ResponseEntity<String> declineFriendRequest(
            @PathVariable int senderId
    ){
        friendRequestService.declineFriendRequestFromUserId(senderId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{recipientId}")
    public ResponseEntity<String> deleteFriendRequest(
            @PathVariable int recipientId
    ){
        friendRequestService.deleteFriendRequestToUserId(recipientId);
        return ResponseEntity.noContent().build();
    }
}
