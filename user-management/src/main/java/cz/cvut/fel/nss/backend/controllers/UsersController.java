package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.dto.*;
import cz.cvut.fel.nss.backend.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UsersService userService;

    @PostMapping()
    public ResponseEntity<String> addUser(@RequestBody SignUpDto credentials) {
        userService.addUser(credentials);
        return ResponseEntity.created(URI.create("/users/" + credentials.getUsername())).body("User added successfully");
    }

    @PutMapping()
    public ResponseEntity<String> updateUser(@RequestBody UserEntityDto userDto) {
        userService.updateUser(userDto);
        return ResponseEntity.ok("User updated successfully");
    }

    @PutMapping("/details")
    public ResponseEntity<String> updateUserDetails(@RequestBody UserDetailDto userDto) {
        userService.updateUserDetail(userDto);
        return ResponseEntity.ok("User details updated successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestHeader("username") String username, @RequestHeader("password") String password) {
        userService.authenticateUser(username, password);
        return ResponseEntity.ok("User logged in successfully");
    }

    @GetMapping("/{username}")
    public ResponseEntity<CombinedUserDto> getUserDetails(@PathVariable String username) {
        CombinedUserDto user = userService.getUser(username);
        return ResponseEntity.ok(user);
    }
}
