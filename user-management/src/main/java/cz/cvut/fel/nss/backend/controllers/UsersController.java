package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.dto.*;
import cz.cvut.fel.nss.backend.services.PictureService;
import cz.cvut.fel.nss.backend.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UsersService userService;
    @Autowired
    PictureService pictureService;

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

    @PutMapping("/{username}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        pictureService.addPicture(file, username);
        return ResponseEntity.ok("Profile photo uploaded successfully");
    }

    @DeleteMapping("/{username}/profilePhoto")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable String username) {
        pictureService.deletePicture(username);
        return ResponseEntity.ok("Profile photo deleted successfully");
    }
}
