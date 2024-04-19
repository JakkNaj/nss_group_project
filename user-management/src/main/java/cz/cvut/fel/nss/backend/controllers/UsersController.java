package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.AccountState;
import cz.cvut.fel.nss.backend.entities.UserEntity;
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

    @PostMapping()
    public ResponseEntity<CombinedUserDto> addUser(@RequestBody SignUpDto credentials) {
        UserEntity user = userService.addUser(credentials);
        CombinedUserDto response = userService.getUser(user.getUsername());
        return ResponseEntity.created(URI.create("/users" + user.getUsername())).body(response);
    }

    @PutMapping()
    public ResponseEntity<CombinedUserDto> updateUser(@RequestBody UserEntityDto userDto) {
        userService.updateUser(userDto);
        CombinedUserDto updatedUserDetail = userService.getUser(userDto.getId());
        return ResponseEntity.ok(updatedUserDetail);
    }

    @PutMapping("/details")
    public ResponseEntity<CombinedUserDto> updateUserDetails(@RequestBody UserDetailDto userDto) {
        userService.updateUserDetail(userDto);
        CombinedUserDto updatedUserDetail = userService.getUser(userDto.getId());
        return ResponseEntity.ok(updatedUserDetail);
    }

    @PostMapping("/login")
    public ResponseEntity<CombinedUserDto> loginUser(@RequestHeader("username") String username, @RequestHeader("password") String password) {
        userService.authenticateUser(username, password);
        int userId = userService.findByUsername(username).getId();
        CombinedUserDto loggedUser = userService.getUser(userId);
        return ResponseEntity.ok(loggedUser);
    }

    /**
     * Get details of a user
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<CombinedUserDto> getUserDetails(@PathVariable int id) {
        CombinedUserDto user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get profile photo of a user
     * @param id
     * @return
     */
    @GetMapping("/{id}/profilePhoto")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable int id) {
        if (userService.getUser(id).getAccountState() == AccountState.DELETED) {
            return ResponseEntity.ok(new byte[0]); // return deleted image
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(pictureService.getPicture(id), headers, HttpStatus.OK);
    }

    /**
     * Upload or update profile photo of a user
     * @param id
     * @param file
     * @return
     */
    @PutMapping("/{id}/profilePhoto")
    public ResponseEntity<String> updateProfilePhoto(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        pictureService.addPicture(file, id);
        return ResponseEntity.ok("Profile photo uploaded successfully");
    }

    //TODO: odstranit multipart
    @PostMapping("/{id}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable int id, @RequestHeader("file") MultipartFile file) {
        pictureService.addPicture(file, id);
        return ResponseEntity.ok("Profile photo uploaded successfully");
    }

    /**
     * Delete profile photo of a user
     * @param id
     * @return
     */
    @DeleteMapping("/{id}/profilePhoto")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable int id) {
        pictureService.deletePicture(id);
        return ResponseEntity.ok("Profile photo deleted successfully");
    }
}
