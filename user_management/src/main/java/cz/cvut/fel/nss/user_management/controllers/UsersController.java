package cz.cvut.fel.nss.user_management.controllers;

import cz.cvut.fel.nss.user_management.entities.AccountState;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import cz.cvut.fel.nss.user_management.entities.dto.*;
import cz.cvut.fel.nss.user_management.exception.NotFoundException;
import cz.cvut.fel.nss.user_management.services.PictureService;
import cz.cvut.fel.nss.user_management.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;


@RestController
@RequestMapping("/users")
public class UsersController {
    private final UsersService userService;
    private final PictureService pictureService;

    @Autowired
    public UsersController(UsersService userService, PictureService pictureService) {
        this.userService = userService;
        this.pictureService = pictureService;
    }


    @PostMapping()
    public ResponseEntity<CombinedUserDto> addUser(@RequestBody SignUpDto credentials) {
        UserEntity user = userService.addUser(credentials);
        CombinedUserDto response = userService.getUserByUsername(credentials.getUsername());
        return ResponseEntity.created(URI.create("/users" + user.getUsername())).body(response);
    }

    @PutMapping()
    public ResponseEntity<CombinedUserDto> updateUser(@RequestBody UpdateUserEntityDto userDto) {
        userService.updateUser(userDto);
        CombinedUserDto updatedUserDetail = userService.getUserByUserid(userDto.getUserId());
        return ResponseEntity.ok(updatedUserDetail);
    }

    @PutMapping("/details")
    public ResponseEntity<CombinedUserDto> updateUserDetails(@RequestBody UserDetailDto userDto) {
        userService.updateUserDetail(userDto);
        CombinedUserDto updatedUserDetail = userService.getUserByUserid(userDto.getUserId());
        return ResponseEntity.ok(updatedUserDetail);
    }

    @PostMapping("/login")
    public ResponseEntity<CombinedUserDto> loginUser(@RequestHeader("username") String username, @RequestHeader("password") String password) {
        userService.authenticateUser(username, password);
        CombinedUserDto loggedUser = userService.getUserByUsername(username);
        return ResponseEntity.ok(loggedUser);
    }

    /**
     * Get details of a user
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<CombinedUserDto> getUserDetails(@PathVariable int id) {
        CombinedUserDto user = userService.getUserByUserid(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get profile photo of a user
     * @param id
     * @return
     */
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<String> getThumbnail(@PathVariable int id) throws IOException {
        if (userService.getUserByUserid(id).getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + id + " does not exist");
        }
        String thumbnail = pictureService.getProfilePhotoThumbnailAsString(id);
        return new ResponseEntity<>(thumbnail, HttpStatus.OK);
    }

    @GetMapping("/{id}/profilePhoto")
    public ResponseEntity<String> getProfilePhoto(@PathVariable int id) throws IOException {
        if (userService.getUserByUserid(id).getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + id + " does not exist");
        }
        String profilePhoto = pictureService.getProfilePhotoAsString(id);
        return new ResponseEntity<>(profilePhoto, HttpStatus.OK);
    }

    /**
     * Upload or update profile photo of a user
     * @param id
     * @param file
     * @return
     */
    @PutMapping("/{id}/profilePhoto")
    public ResponseEntity<String> updateProfilePhoto(@PathVariable int id, @RequestParam("file") MultipartFile file) throws IOException {
        pictureService.addPicture(file, id);
        String thumbnail = pictureService.getProfilePhotoThumbnailAsString(id);
        return new ResponseEntity<>(thumbnail, HttpStatus.OK);
    }

    /**
     * Upload or update profile photo of a user
     * @param id
     * @param file
     * @return
     */
    @PostMapping("/{id}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable int id, @RequestParam("file") MultipartFile file) throws IOException {
        pictureService.addPicture(file, id);
        String thumbnail = pictureService.getProfilePhotoThumbnailAsString(id);
        return new ResponseEntity<>(thumbnail, HttpStatus.OK);
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
