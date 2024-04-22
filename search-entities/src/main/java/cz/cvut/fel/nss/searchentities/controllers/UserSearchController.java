package cz.cvut.fel.nss.searchentities.controllers;


import cz.cvut.fel.nss.user_management.entities.dto.UserEntityDto;
import cz.cvut.fel.nss.searchentities.services.UserSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/searchEntities")
public class UserSearchController {
    @Autowired
    private UserSearchService userSearchService;

    @Value("${username.page.size}")
    private int pageSize;

    @GetMapping
    public ResponseEntity<List<UserEntityDto>> searchUser(@RequestParam("username") String username, @RequestParam("page") int page) {
        List<UserEntityDto> users = userSearchService.searchUsers(username, page, pageSize).stream().map(UserEntityDto::new).toList();
        return ResponseEntity.ok(users);
    }
}
