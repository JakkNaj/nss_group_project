package cz.cvut.fel.nss.user_relations.controller;

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

    @GetMapping("/{userId}")
    public ResponseEntity<List<Integer>> getAllFriends(@PathVariable int userId){
        return new ResponseEntity<>(friendService.getAllFriendIds(userId), HttpStatus.OK);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<String> removeFriend(@PathVariable int userId){
        friendService.removeFriend(userId);
        return ResponseEntity.noContent().build();
    }
}
