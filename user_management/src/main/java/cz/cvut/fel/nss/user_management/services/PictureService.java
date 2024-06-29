package cz.cvut.fel.nss.user_management.services;

import cz.cvut.fel.nss.user_management.dao.UserRepository;
import cz.cvut.fel.nss.user_management.entities.AccountState;
import cz.cvut.fel.nss.user_management.entities.PictureEntity;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import cz.cvut.fel.nss.user_management.exception.NotFoundException;
import cz.cvut.fel.nss.user_management.exception.WrongFileException;
import cz.cvut.fel.nss.user_management.repositories.PictureEntityRepository;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class PictureService {
    private final PictureEntityRepository pictureRepository;
    private final UserRepository userRepository;
    private final ImageResizingService imageResizingService;
    private final CacheManager cacheManager;

    @Autowired
    public PictureService(PictureEntityRepository pictureRepository, UserRepository userRepository,
                          ImageResizingService imageResizingService, CacheManager cacheManager) {
        this.pictureRepository = pictureRepository;
        this.userRepository = userRepository;
        this.imageResizingService = imageResizingService;
        this.cacheManager = cacheManager;
    }

    @Value("${profilephoto.max.size}")
    private int maxProfilePhotoSize;

    @SneakyThrows
    public void addPicture(MultipartFile file, int userId) {
        if (file == null) {
            throw new WrongFileException("File is null");
        }
        validateUser(userId);
        validateFile(file);
        PictureEntity pictureEntity = pictureRepository.findById(userId).orElse(new PictureEntity());
        byte[] thumbnail = imageResizingService.createThumbnail(file.getBytes());
        pictureEntity.savePicture(file.getBytes(), thumbnail, userId, file.getContentType());
        log.info("Saving picture for user with id {}", userId);
        pictureRepository.save(pictureEntity);
        updateCacheManually(userId);
    }

    private void validateUser(int userId) {
        Optional<UserEntity> user = userRepository.findById(userId);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + userId + " does not exist");
        }
    }

    @SneakyThrows
    private void validateFile(MultipartFile file) {
        if (file.getSize() > maxProfilePhotoSize) {
            throw new WrongFileException("File is too big");
        }
        if (!"image/jpeg".equals(file.getContentType()) && !Objects.equals(file.getContentType(), "image/png")) {
            log.info("File content type: {}", file.getContentType());
            throw new WrongFileException("File is not a valid image format");
        }
    }

    @CacheEvict(cacheNames = "profilePhotoThumbnail", key = "#userId")
    public void deletePicture(int userId) {
        Optional<PictureEntity> picture = pictureRepository.findById(userId);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with id " + userId + " does not have a profile photo");
        }
        pictureRepository.deleteById(userId);
    }

    @SneakyThrows
    public byte[] getProfilePhoto(int userId) {
        Optional<PictureEntity> pictureEntity = pictureRepository.findById(userId);
        if (pictureEntity.isEmpty())
            return getDefaultPictureEntity(userId).getStoredPicture();
        else
            return pictureEntity.get().getStoredPicture();
    }

    @SneakyThrows
    public byte[] getProfilePhotoThumbnail(int userId) {
        Optional<PictureEntity> pictureEntity = pictureRepository.findById(userId);
        if (pictureEntity.isEmpty())
            return getDefaultPictureEntity(userId).getThumbnail();
        else
            return pictureEntity.get().getThumbnail();
    }

    private static PictureEntity getDefaultPictureEntity(int userId) throws IOException {
        // Load the default image file into a byte[]
        byte[] defaultImage;
        defaultImage = Files.readAllBytes(Paths.get("user_management/src/main/resources/assets/images/default-user-icon-scaled.png"));

        // Use the default image to create a new PictureEntity
        PictureEntity defaultPictureEntity = new PictureEntity();
        defaultPictureEntity.savePicture(defaultImage, defaultImage, userId, "image/png");
        return defaultPictureEntity;
    }

    public String getProfilePhotoAsString(int userId) throws IOException {
        byte[] profilePhoto = getProfilePhoto(userId);
        return Base64.getEncoder().encodeToString(profilePhoto);
    }

    //@Cacheable(cacheNames = "profilePhotoThumbnail", key = "#userId")
    public String getProfilePhotoThumbnailAsString(int userId) {
        byte[] profilePhotoThumbnail = getProfilePhotoThumbnail(userId);
        return Base64.getEncoder().encodeToString(profilePhotoThumbnail);
    }

    private void updateCacheManually(int userId) {
        Cache cache = cacheManager.getCache("profilePhotoThumbnail");
        if (cache != null) {
            cache.put(userId, getProfilePhotoThumbnailAsString(userId));
        }
    }
}
