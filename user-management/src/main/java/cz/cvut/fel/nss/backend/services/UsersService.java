package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserRepository;
import cz.cvut.fel.nss.backend.entities.AccountState;
import cz.cvut.fel.nss.backend.entities.UserDetail;
import cz.cvut.fel.nss.backend.entities.UserDetailKey;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.backend.entities.dto.SignUpDto;
import cz.cvut.fel.nss.backend.entities.dto.UserDetailDto;
import cz.cvut.fel.nss.backend.entities.dto.UserEntityDto;
import cz.cvut.fel.nss.backend.exception.BadRequestException;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import cz.cvut.fel.nss.backend.repositories.UserDetailRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Slf4j
public class UsersService {
    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    @Value("${username.min.length}")
    private int minUsernameLength;

    @Value("${username.max.length}")
    private int maxUsernameLength;

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

    @Transactional
    public void addUser(SignUpDto signUpDto) {
        basicValidation(signUpDto.getUsername());
        Optional<UserEntity> existingUser = userRepository.findByUsername(signUpDto.getUsername());
        UserEntity user = new UserEntity();
        if (existingUser.isPresent()) {
            throw new BadRequestException("User with username " + user.getUsername() + " already exists");
        }
        user.setUsername(signUpDto.getUsername());
        user.setName(signUpDto.getName());
        user.setPassword(signUpDto.getPassword()); // maybe use passwordEncoder.encode(user.getPassword())
        user.setAccountState(AccountState.ACTIVE);
        userRepository.save(user);

        UserDetail userDetail = new UserDetail();
        userDetail.addDetail(user, UserDetailKey.EMAIL, signUpDto.getEmail());
        userDetail.addDetail(user, UserDetailKey.ACCOUNT_CREATED, LocalDate.now().toString());
        userDetailRepository.save(userDetail);
    }

    public void updateUser(UserEntityDto userEntityDto) {
        basicValidation(userEntityDto.getUsername());
        Optional<UserEntity> existingUser = userRepository.findByUsername(userEntityDto.getUsername());
        if (existingUser.isEmpty() || existingUser.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + userEntityDto.getUsername() + " does not exist");
        }
        if (userEntityDto.getPassword() != null)
            existingUser.get().setPassword(userEntityDto.getPassword());
        existingUser.get().setName(userEntityDto.getName());
        existingUser.get().setAccountState(userEntityDto.getAccountState());
        userRepository.save(existingUser.get());
        log.info("user updated");
    }

    private void basicValidation (String username) {
        if (username.length() < minUsernameLength || username.length() > maxUsernameLength) {
            throw new BadRequestException("Username must be between " + minUsernameLength + " and " + maxUsernameLength + " characters");
        }
    }

    public void authenticateUser(String username, String encodedPassword) {
        if (userRepository.findByUsername(username).isPresent()){
            if (!Objects.equals(
                    encodedPassword,
                    userRepository.findByUsername(username).get().getPassword()))
                throw new BadRequestException("Wrong credentials");
        } else {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
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

    public CombinedUserDto getUser(String username) {
        UserEntity user = findByUsername(username);
        UserDetail userDetail = userDetailRepository.findById(user.getUsername()).orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        CombinedUserDto combinedUserDto = new CombinedUserDto();
        combinedUserDto.setUsername(username);
        combinedUserDto.setName(user.getName());
        combinedUserDto.setAccountState(user.getAccountState());
        combinedUserDto.setEmail(userDetail.getDetails().get(UserDetailKey.EMAIL));
        combinedUserDto.setPhone(userDetail.getDetails().get(UserDetailKey.PHONE));
        combinedUserDto.setAddress(userDetail.getDetails().get(UserDetailKey.ADDRESS));
        combinedUserDto.setBirthdate(userDetail.getDetails().get(UserDetailKey.BIRTHDATE));
        combinedUserDto.setAccountCreated(userDetail.getDetails().get(UserDetailKey.ACCOUNT_CREATED));
        return combinedUserDto;
    }
}
