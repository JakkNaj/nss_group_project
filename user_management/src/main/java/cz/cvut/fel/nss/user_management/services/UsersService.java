package cz.cvut.fel.nss.user_management.services;

import cz.cvut.fel.nss.user_management.dao.UserRepository;
import cz.cvut.fel.nss.user_management.entities.*;
import cz.cvut.fel.nss.user_management.entities.dto.*;
import cz.cvut.fel.nss.user_management.exception.BadRequestException;
import cz.cvut.fel.nss.user_management.exception.ConflictException;
import cz.cvut.fel.nss.user_management.exception.NotFoundException;
import cz.cvut.fel.nss.user_management.repositories.UserDetailRepository;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;

@Service
@Slf4j
public class UsersService {
    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final MongoTemplate mongoTemplate;
    private final PictureService pictureService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    @Value("${username.min.length}")
    private int minUsernameLength;

    @Value("${username.max.length}")
    private int maxUsernameLength;

    @Autowired
    public UsersService(UserRepository userRepository, UserDetailRepository userDetailRepository,
                        MongoTemplate mongoTemplate, PictureService pictureService) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.mongoTemplate = mongoTemplate;
        this.pictureService = pictureService;
    }

    public UserEntity findByUsername(String username) {
        Optional<UserEntity> user =  userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        return user.get();
    }

    public UserEntity findByUserId(int userId) {
        Optional<UserEntity> user =  userRepository.findById(userId);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            log.info("User with id " + userId + " does not exist");
            throw new NotFoundException("User with id " + userId + " does not exist");
        }
        return user.get();
    }

    @Transactional
    public UserEntity addUser(SignUpDto signUpDto) {
        basicValidation(signUpDto.getUsername(), signUpDto.getEmail());
        Optional<UserEntity> existingUser = userRepository.findByUsername(signUpDto.getUsername());
        if (existingUser.isPresent()) {
            throw new BadRequestException("User with username " + signUpDto.getUsername() + " already exists");
        }
        UserEntity user = new UserEntity(signUpDto);
        userRepository.save(user);

        UserDetail userDetail = new UserDetail(findByUsername(signUpDto.getUsername()).getUserId());
        userDetail.addValue(UserDetailKey.DATE_CREATED, new DateUserDetail(LocalDate.now()));
        userDetailRepository.save(userDetail);
        return user;
    }


    public void updateUser(UpdateUserEntityDto updateUserEntityDto) {
        Optional<UserEntity> existingUser = userRepository.findById(updateUserEntityDto.getUserId());
        if (existingUser.isEmpty() || existingUser.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + findByUserId(updateUserEntityDto.getUserId()).getUsername() + " does not exist");
        }
        if (!Objects.equals(existingUser.get().getEmail(), updateUserEntityDto.getEmail())) {
            emailValidation(updateUserEntityDto.getEmail());
            existingUser.get().setEmail(updateUserEntityDto.getEmail());
        }
        if (!Objects.equals(existingUser.get().getUsername(), updateUserEntityDto.getUsername())) {
            usernameValidation(updateUserEntityDto.getUsername());
            existingUser.get().setUsername(updateUserEntityDto.getUsername());
        }
        if (!Objects.equals(existingUser.get().getName(), updateUserEntityDto.getName()))
            existingUser.get().setName(updateUserEntityDto.getName());
        if (!Objects.equals(existingUser.get().getAccountState(), updateUserEntityDto.getAccountState()))
            existingUser.get().setAccountState(updateUserEntityDto.getAccountState());
        userRepository.save(existingUser.get());
    }

    private void emailValidation (String email) {
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email must be unique");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new BadRequestException("Email must be valid");
        }
    }

    private void usernameValidation (String username) {
        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username must be unique");
        }
        if (username.length() < minUsernameLength || username.length() > maxUsernameLength) {
            throw new BadRequestException("Username must be between " + minUsernameLength + " and " + maxUsernameLength + " characters");
        }
    }

    private void basicValidation (String username, String email) {
        usernameValidation(username);
        emailValidation(email);
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
     * Please note that only country codes in PhoneCountryCode enum are allowed
     * @param userDetailDto
     */
    @Transactional
    public void updateUserDetail(UserDetailDto userDetailDto) {
        UserEntity user = findByUserId(userDetailDto.getUserId());
        UserDetail userDetail = userDetailRepository.findById(user.getUserId())
                .orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        // check changes
        updateAddress(userDetailDto, userDetail);
        updatePhoneNumbers(userDetailDto, user, userDetail);
        updateBirthdate(userDetailDto, userDetail);
        userDetailRepository.save(userDetail);
    }

    private void updatePhoneNumbers(UserDetailDto userDetailDto, UserEntity user, UserDetail userDetail) {
        if (userDetailDto.getPhones() != null) {
            Optional<PhoneNumbers> phoneNumbers = userDetail.getValue(UserDetailKey.PHONE_NUMBERS, PhoneNumbers.class);
            if (phoneNumbers.isPresent()) {
                if (phoneNumbers.get().equals(userDetailDto.getPhones())) {
                    return;
                }
                userDetail.removeValue(UserDetailKey.PHONE_NUMBERS);
            }
            for (PhoneNumber phoneNumber : userDetailDto.getPhones().getListOfPhoneNumbers()) {
                if (!isPhoneInValidFormat(phoneNumber.getTelephoneNumber()))
                    throw new BadRequestException("Phone number " + phoneNumber.getTelephoneNumber() + " with prefix " + phoneNumber.getCountry() + " is not in a valid format");
                if (isPhoneNumberAssignedToDifferentUser(phoneNumber, user.getUserId()))
                    throw new BadRequestException("Phone number " + phoneNumber.getTelephoneNumber() + " with prefix " + phoneNumber.getCountry() + " is already assigned to a different user");
            }
            userDetail.addValue(UserDetailKey.PHONE_NUMBERS, userDetailDto.getPhones());
        }
    }

    public boolean isPhoneInValidFormat(String telephoneNumber) {
        return telephoneNumber.matches("^[\\+]?\\d{9,12}$");
    }

    public boolean isPhoneNumberAssignedToDifferentUser(PhoneNumber phoneNumber, int userId) {
        Criteria criteria = new Criteria();
        criteria.andOperator(
                Criteria.where("_id").ne(userId),
                Criteria.where("element").elemMatch(
                        Criteria.where("type").is("PHONE_NUMBERS")
                                .and("listOfPhoneNumbers").is(phoneNumber)
                )
        );
        Query query = new Query(criteria);
        return mongoTemplate.exists(query, UserDetail.class);
    }

    private void updateAddress(UserDetailDto userDetailDto, UserDetail userDetail) {
        AddressDto addressDto = userDetailDto.getAddress();
        if(addressDto != null) {
            Optional<Address> address = userDetail.getValue(UserDetailKey.ADDRESS, Address.class);
            if (address.isPresent() && !address.get().equals(new Address(addressDto))) {
                userDetail.removeValue(UserDetailKey.ADDRESS);
                userDetail.addValue(UserDetailKey.ADDRESS, new Address(addressDto));
            } else if (address.isEmpty()) {
                userDetail.addValue(UserDetailKey.ADDRESS, new Address(addressDto));
            }
        }
    }

    private void updateBirthdate(UserDetailDto userDetailDto, UserDetail userDetail) {
        if (userDetailDto.getBirthdate() != null) {
            Optional<DateUserDetail> birthdate = userDetail.getValue(UserDetailKey.BIRTHDATE, DateUserDetail.class);
            if (birthdate.isPresent() && !birthdate.get().getDate().equals(userDetailDto.getBirthdate())) {
                userDetail.removeValue(UserDetailKey.BIRTHDATE);
                userDetail.addValue(UserDetailKey.BIRTHDATE, new DateUserDetail(userDetailDto.getBirthdate()));
            } else if (birthdate.isEmpty()) {
                userDetail.addValue(UserDetailKey.BIRTHDATE, new DateUserDetail(userDetailDto.getBirthdate()));
            }
        }
    }

    public CombinedUserDto getUserByUserid(int userId) {
        return getCombinedUserDtoFromUserEntity(findByUserId(userId));
    }

    public CombinedUserDto getUserByUsername(String username) {
        return getCombinedUserDtoFromUserEntity(findByUsername(username));
    }

    @SneakyThrows
    private CombinedUserDto getCombinedUserDtoFromUserEntity(UserEntity user) {
        if (user.getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + user.getUsername() + " does not exist");
        }
        UserDetail userDetail = userDetailRepository.findById(user.getUserId()).orElseThrow(() -> new NotFoundException("UserDetail with username " + user.getUsername() + " does not exist"));
        CombinedUserDto combinedUserDto = new CombinedUserDto();
        combinedUserDto.setUserId(user.getUserId());
        combinedUserDto.setUsername(user.getUsername());
        combinedUserDto.setName(user.getName());
        combinedUserDto.setAccountState(user.getAccountState());
        combinedUserDto.setEmail(user.getEmail());
        combinedUserDto.setPhones(userDetail.getValue(UserDetailKey.PHONE_NUMBERS, PhoneNumbers.class).orElse(null));
        userDetail.getValue(UserDetailKey.ADDRESS, Address.class).ifPresent(value -> combinedUserDto.setAddress(new AddressDto(value)));
        combinedUserDto.setBirthdate(userDetail.getValue(UserDetailKey.BIRTHDATE, DateUserDetail.class).map(DateUserDetail::getDate).map(LocalDate::toString).orElse(null));
        combinedUserDto.setDateCreated(userDetail.getValue(UserDetailKey.DATE_CREATED, DateUserDetail.class).map(DateUserDetail::getDate).map(LocalDate::toString).orElse(null));
        String encodedImage = Base64.getEncoder().encodeToString(pictureService.getProfilePhotoThumbnail(user.getUserId()));
        combinedUserDto.setThumbnail(encodedImage);
        return combinedUserDto;
    }
}
