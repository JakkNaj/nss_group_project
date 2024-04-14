package cz.cvut.fel.nss.backend.controllers;

import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.entities.dto.*;
import cz.cvut.fel.nss.backend.exception.BadRequestException;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import cz.cvut.fel.nss.backend.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UsersService userService;

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody SignUpDto credentials) {
        try {
            UserEntity user = new UserEntity();
            user.setUsername(credentials.getUsername());
            user.setPassword(credentials.getPassword());
            user.setName(credentials.getName());
            userService.addUser(user, credentials.getEmail());
            return ResponseEntity.created(URI.create("/users/" + user.getUsername())).body("User added successfully");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserEntityDto userDto) {
        try {
            UserEntity user = new UserEntity();
            user.setUsername(userDto.getUsername());
            user.setName(userDto.getName());
            user.setAccountState(userDto.getAccountState());
            userService.updateUser(user);
            return ResponseEntity.ok("User updated successfully");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update-details")
    public ResponseEntity<String> updateUserDetails(@RequestBody UserDetailDto userDto) {
        try {
            userService.updateUserDetail(userDto);
            return ResponseEntity.ok("User details updated successfully");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto credentials) {
        try {
            userService.changePassword(credentials.getUsername(), credentials.getOldPassword(), credentials.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDto credentials) {
        try {
            userService.authenticateUser(credentials.getUsername(), credentials.getPassword());
            return ResponseEntity.ok("User logged in successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable String username) {
        try {
            UserEntity user = userService.findByUsername(username);
            return ResponseEntity.ok(new UserEntityDto(user));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/details/{username}")
    public ResponseEntity<Object> getUserDetails(@PathVariable String username) {
        try {
            UserDetailDto user = userService.getUserDetail(username);
            return ResponseEntity.ok(user);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
