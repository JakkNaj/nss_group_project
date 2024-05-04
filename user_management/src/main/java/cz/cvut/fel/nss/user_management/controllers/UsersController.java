package cz.cvut.fel.nss.user_management.controllers;

import cz.cvut.fel.nss.user_management.entities.AccountState;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import cz.cvut.fel.nss.user_management.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.user_management.entities.dto.SignUpDto;
import cz.cvut.fel.nss.user_management.entities.dto.UserDetailDto;
import cz.cvut.fel.nss.user_management.entities.dto.UserEntityDto;
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

import java.net.URI;
import java.util.Base64;


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
    public ResponseEntity<CombinedUserDto> updateUser(@RequestBody UserEntityDto userDto) {
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
    @GetMapping("/{id}/profilePhoto")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable int id) {
        if (userService.getUserByUserid(id).getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + id + " does not exist");
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
    /*@PostMapping("/{id}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable int id, @RequestHeader("file") MultipartFile file) {
        pictureService.addPicture(file, id);
        return ResponseEntity.ok("Profile photo uploaded successfully");
    }*/

    //Jakub: oprava endpointu pro upload fotky
    @PostMapping("/{id}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        pictureService.addPicture(file, id);
        String encodedImage = Base64.getEncoder().encodeToString(pictureService.getPicture(id));
        return ResponseEntity.ok(encodedImage);
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
