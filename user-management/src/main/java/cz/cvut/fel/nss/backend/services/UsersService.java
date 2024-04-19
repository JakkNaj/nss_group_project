package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserRepository;
import cz.cvut.fel.nss.backend.entities.*;
import cz.cvut.fel.nss.backend.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.backend.entities.dto.SignUpDto;
import cz.cvut.fel.nss.backend.entities.dto.UserDetailDto;
import cz.cvut.fel.nss.backend.entities.dto.UserEntityDto;
import cz.cvut.fel.nss.backend.exception.BadRequestException;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import cz.cvut.fel.nss.backend.repositories.PictureEntityRepository;
import cz.cvut.fel.nss.backend.repositories.UserDetailRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Slf4j
public class UsersService {
    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final PictureEntityRepository pictureEntityRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    @Value("${username.min.length}")
    private int minUsernameLength;

    @Value("${username.max.length}")
    private int maxUsernameLength;

    @Autowired
    public UsersService(UserRepository userRepository, UserDetailRepository userDetailRepository, PictureEntityRepository pictureEntityRepository) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.pictureEntityRepository = pictureEntityRepository;
    }

    public UserEntity findByUsername(String username) {
        Optional<UserEntity> user =  userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        return user.get();
    }

    public UserEntity findById(int id) {
        Optional<UserEntity> user =  userRepository.findById(id);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + id + " does not exist");
        }
        return user.get();
    }

    @Transactional
    public UserEntity addUser(SignUpDto signUpDto) {
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
        userDetail.addDetail(findByUsername(signUpDto.getUsername()).getId(), UserDetailKey.EMAIL, signUpDto.getEmail());
        userDetail.addDetail(findByUsername(signUpDto.getUsername()).getId(), UserDetailKey.DATE_CREATED, LocalDate.now().toString());
        userDetailRepository.save(userDetail);
        return user;
    }

    public void updateUser(UserEntityDto userEntityDto) {
        basicValidation(findById(userEntityDto.getId()).getUsername());
        Optional<UserEntity> existingUser = userRepository.findById(userEntityDto.getId());
        if (existingUser.isEmpty() || existingUser.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + findById(userEntityDto.getId()).getUsername() + " does not exist");
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

    /**
     * Won't update dateCreated
     * @param userDetailDto
     */
    public void updateUserDetail(UserDetailDto userDetailDto) {
        UserEntity user = findById(userDetailDto.getId());
        UserDetail userDetail = userDetailRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        userDetail.addDetail(user.getId(), UserDetailKey.EMAIL, userDetailDto.getEmail());
        userDetail.addDetail(user.getId(), UserDetailKey.PHONE, userDetailDto.getPhone());
        userDetail.addDetail(user.getId(), UserDetailKey.ADDRESS, userDetailDto.getAddress());
        userDetail.addDetail(user.getId(), UserDetailKey.BIRTHDATE, userDetailDto.getBirthdate());
        userDetailRepository.save(userDetail);
    }

    public CombinedUserDto getUser(int id) {
        return getUserImplementation(findById(id));
    }

    public CombinedUserDto getUser(String username) {
        return getUserImplementation(findByUsername(username));
    }

    private CombinedUserDto getUserImplementation(UserEntity user) {
        UserDetail userDetail = userDetailRepository.findById(user.getId()).orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        PictureEntity pictureEntity = pictureEntityRepository.findById(user.getId()).orElse(null);
        CombinedUserDto combinedUserDto = new CombinedUserDto();
        combinedUserDto.setId(user.getId());
        combinedUserDto.setUsername(user.getUsername());
        combinedUserDto.setName(user.getName());
        combinedUserDto.setAccountState(user.getAccountState());
        combinedUserDto.setEmail(userDetail.getDetails().get(UserDetailKey.EMAIL));
        combinedUserDto.setPhone(userDetail.getDetails().get(UserDetailKey.PHONE));
        combinedUserDto.setAddress(userDetail.getDetails().get(UserDetailKey.ADDRESS));
        combinedUserDto.setBirthdate(userDetail.getDetails().get(UserDetailKey.BIRTHDATE));
        combinedUserDto.setDateCreated(userDetail.getDetails().get(UserDetailKey.DATE_CREATED));
        if (pictureEntity != null) {
            String encodedImage = Base64.getEncoder().encodeToString(pictureEntity.getThumbnail());
            combinedUserDto.setThumbnail(encodedImage);
        }
        return combinedUserDto;
    }
}
