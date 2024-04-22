package cz.cvut.fel.nss.user_relations.controller;

import cz.cvut.fel.nss.user_relations.entity.Friendship;
import cz.cvut.fel.nss.user_relations.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/friends")
public class FriendController {
    @Autowired
    FriendService friendService;

    @GetMapping("/{username}")
    public ResponseEntity<List<Friendship>> getAllFriends(@PathVariable String username){
        return new ResponseEntity<>(friendService.getAllFriends(username), HttpStatus.OK);
    }

    @DeleteMapping("/{username}")
//    loggedInUser == Principal.getUsername()
    public ResponseEntity<String> removeFriend(String loggedInUser, @PathVariable String username){
        friendService.removeFriend(loggedInUser, username);
        return ResponseEntity.noContent().build();
    }

}
