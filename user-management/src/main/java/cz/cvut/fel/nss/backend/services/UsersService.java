package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserRepository;
import cz.cvut.fel.nss.backend.entities.AccountState;
import cz.cvut.fel.nss.backend.entities.UserDetail;
import cz.cvut.fel.nss.backend.entities.UserDetailKey;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.entities.dto.UserDetailDto;
import cz.cvut.fel.nss.backend.exception.BadRequestException;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import cz.cvut.fel.nss.backend.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

import static java.util.Objects.requireNonNull;

@Service
public class UsersService {
    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    @Autowired
    public UsersService(UserRepository userRepository, UserDetailRepository userDetailRepository) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
    }

    public UserEntity findByUsername(String username) {
        Optional<UserEntity> user =  userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        return user.get();
    }

    public void addUser(UserEntity user, String email) {
        basicValidation(user);
        Optional<UserEntity> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new BadRequestException("User with username " + user.getUsername() + " already exists");
        }
        user.setPassword(user.getPassword()); // maybe use passwordEncoder.encode(user.getPassword())
        user.setAccountState(AccountState.ACTIVE);
        userRepository.save(user);

        UserDetail userDetail = new UserDetail();
        userDetail.addDetail(user, UserDetailKey.EMAIL, email);
        userDetail.addDetail(user, UserDetailKey.ACCOUNT_CREATED, LocalDate.now().toString());
        userDetailRepository.save(userDetail);
    }

    public void updateUser(UserEntity user) {
        basicValidation(user);
        Optional<UserEntity> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isEmpty() || existingUser.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + user.getUsername() + " does not exist");
        }
        existingUser.get().setName(user.getName());
        existingUser.get().setAccountState(user.getAccountState());
        userRepository.save(existingUser.get());
    }

    private void basicValidation (UserEntity user) {
        if (user.getUsername().length() < 3 || user.getUsername().length() > 20) {
            throw new BadRequestException("Username must be between 3 and 20 characters");
        }
    }

    public boolean authenticateUser(String username, String encodedPassword) {
        if (userRepository.findByUsername(username).isPresent()){
            if (!Objects.equals(
                    encodedPassword,
                    userRepository.findByUsername(username).get().getPassword()))
                throw new BadRequestException("Wrong credentials");
            else
                return true;
        } else {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        Optional<UserEntity> existingUser = userRepository.findByUsername(username);
        if (existingUser.isEmpty() || existingUser.get().getAccountState() == AccountState.DELETED) {
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
        throw new BadRequestException("Wrong credentials");
    }

    public void updateUserDetail(UserDetailDto userDetailDto) {
        UserEntity user = findByUsername(userDetailDto.getUsername());
        UserDetail userDetail = userDetailRepository.findById(user.getUsername())
                .orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        userDetail.addDetail(user, UserDetailKey.EMAIL, userDetailDto.getEmail());
        userDetail.addDetail(user, UserDetailKey.PHONE, userDetailDto.getPhone());
        userDetail.addDetail(user, UserDetailKey.ADDRESS, userDetailDto.getAddress());
        userDetail.addDetail(user, UserDetailKey.BIRTHDATE, userDetailDto.getBirthdate());
        userDetail.addDetail(user, UserDetailKey.ACCOUNT_CREATED, userDetailDto.getAccountCreated());
        userDetailRepository.save(userDetail);
    }

    public UserDetailDto getUserDetail(String username) {
        UserEntity user = findByUsername(username);
        UserDetail userDetail = userDetailRepository.findById(user.getUsername()).orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        UserDetailDto userDetailDto = new UserDetailDto();
        userDetailDto.setUsername(user.getUsername());
        userDetailDto.setEmail(userDetail.getDetails().get(UserDetailKey.EMAIL));
        userDetailDto.setPhone(userDetail.getDetails().get(UserDetailKey.PHONE));
        userDetailDto.setAddress(userDetail.getDetails().get(UserDetailKey.ADDRESS));
        userDetailDto.setBirthdate(userDetail.getDetails().get(UserDetailKey.BIRTHDATE));
        userDetailDto.setAccountCreated(userDetail.getDetails().get(UserDetailKey.ACCOUNT_CREATED));
        return userDetailDto;
    }
}
