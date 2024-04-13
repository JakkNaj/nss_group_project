package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserRepository;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.exception.BadRequestException;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

import static java.util.Objects.requireNonNull;

@Service
public class UserService {
    private final UserRepository userRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity findByUsername(String username) {
        Optional<UserEntity> user =  userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().isDeleted()) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        return user.get();
    }

    public void addUser(UserEntity user) {
        basicValidation(user);
        user.setAccountCreated(LocalDate.now());
        user.setPassword(user.getPassword()); // maybe use passwordEncoder.encode(user.getPassword())
        user.setDeleted(false);
        userRepository.save(user);
    }

    public void updateUser(UserEntity user) {
        basicValidation(user);
        Optional<UserEntity> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isEmpty() || existingUser.get().isDeleted()) {
            throw new NotFoundException("User with username " + user.getUsername() + " does not exist");
        }
        existingUser.get().setEmail(user.getEmail());
        existingUser.get().setName(user.getName());
        existingUser.get().setDeleted(user.isDeleted());
        userRepository.save(existingUser.get());
    }

    private void basicValidation (UserEntity user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (!EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (user.getUsername().length() < 3 || user.getUsername().length() > 20) {
            throw new BadRequestException("Username must be between 3 and 20 characters");
        }
    }

    public boolean authenticateUser(String username, String encodedPassword) {
        if (userRepository.findByUsername(username).isPresent()){
            return Objects.equals(
                    encodedPassword,
                    userRepository.findByUsername(username).get().getPassword());
        } else {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        Optional<UserEntity> existingUser = userRepository.findByUsername(username);
        if (existingUser.isEmpty() || existingUser.get().isDeleted()) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        if (oldPassword == null || newPassword == null) {
            throw new BadRequestException("Old and new password must be specified");
        }
        if (oldPassword.equals(newPassword)) {
            throw new BadRequestException("New password must be different from the old one");
        }
        requireNonNull(oldPassword);
        requireNonNull(newPassword);
        if (authenticateUser(username, oldPassword)){
            existingUser.get().setPassword(newPassword);
            userRepository.save(existingUser.get());
            return;
        }
        throw new BadRequestException("wrong credentials");
    }
}
