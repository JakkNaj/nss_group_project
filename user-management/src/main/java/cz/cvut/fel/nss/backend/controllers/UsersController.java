package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.dto.*;
import cz.cvut.fel.nss.backend.services.PictureService;
import cz.cvut.fel.nss.backend.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UsersService userService;
    @Autowired
    PictureService pictureService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<String> addUser(@RequestPart SignUpDto credentials, @RequestPart("file") Optional<MultipartFile> file) {
        userService.addUser(credentials);
        pictureService.addPicture(file.orElse(null), credentials.getUsername());
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

    /**
     * Get details of a user
     * @param username
     * @return
     */
    @GetMapping("/{username}")
    public ResponseEntity<CombinedUserDto> getUserDetails(@PathVariable String username) {
        CombinedUserDto user = userService.getUser(username);
        return ResponseEntity.ok(user);
    }

    /**
     * Get profile photo of a user
     * @param username
     * @return
     */
    @GetMapping("/{username}/profilePhoto")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable String username) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(pictureService.getPicture(username), headers, HttpStatus.OK);
    }

    /**
     * Upload or update profile photo of a user
     * @param username
     * @param file
     * @return
     */
    @PutMapping("/{username}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        pictureService.addPicture(file, username);
        return ResponseEntity.ok("Profile photo uploaded successfully");
    }

    /**
     * Delete profile photo of a user
     * @param username
     * @return
     */
    @DeleteMapping("/{username}/profilePhoto")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable String username) {
        pictureService.deletePicture(username);
        return ResponseEntity.ok("Profile photo deleted successfully");
    }
}
