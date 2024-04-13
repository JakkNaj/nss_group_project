package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.entities.dto.ChangePasswordDto;
import cz.cvut.fel.nss.backend.entities.dto.LoginDto;
import cz.cvut.fel.nss.backend.entities.dto.SignUpDto;
import cz.cvut.fel.nss.backend.entities.dto.UserEntityDto;
import cz.cvut.fel.nss.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody SignUpDto credentials) {
        UserEntity user = new UserEntity();
        user.setUsername(credentials.getUsername());
        user.setPassword(credentials.getPassword());
        user.setEmail(credentials.getEmail());
        user.setName(credentials.getName());
        userService.addUser(user);
        return ResponseEntity.created(URI.create("/users/" + user.getUsername())).body("User added successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserEntityDto userDto) {
        UserEntity user = new UserEntity();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setDeleted(userDto.isDeleted());
        userService.updateUser(user);
        return ResponseEntity.ok("User updated successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto credentials) {
        userService.changePassword(credentials.getUsername(), credentials.getOldPassword(), credentials.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDto credentials) {
        boolean isAuthenticated = userService.authenticateUser(credentials.getUsername(), credentials.getPassword());
        if (isAuthenticated) {
            return ResponseEntity.ok("User logged in successfully");
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserEntityDto> getUserByUsername(@PathVariable String username) {
        UserEntity user = userService.findByUsername(username);
        return ResponseEntity.ok(new UserEntityDto(user));
    }
}
