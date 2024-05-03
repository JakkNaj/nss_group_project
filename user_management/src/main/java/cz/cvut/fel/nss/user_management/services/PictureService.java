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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class PictureService {
    private final PictureEntityRepository pictureRepository;
    private final UserRepository userRepository;
    private final ImageResizingService imageResizingService;

    @Autowired
    public PictureService(PictureEntityRepository pictureRepository, UserRepository userRepository, ImageResizingService imageResizingService) {
        this.pictureRepository = pictureRepository;
        this.userRepository = userRepository;
        this.imageResizingService = imageResizingService;
    }

    @Value("${profilephoto.max.size}")
    private int maxProfilePhotoSize;

    @SneakyThrows
    public void addPicture(MultipartFile file, int id) {
        if (file == null) {
            throw new WrongFileException("File is null");
        }
        validateUser(id);
        validateFile(file);
        PictureEntity pictureEntity = pictureRepository.findById(id).orElse(new PictureEntity());
        byte[] thumbnail = imageResizingService.createThumbnail(file.getBytes());
        pictureEntity.savePicture(file.getBytes(), thumbnail, id, file.getContentType());
        log.info("Saving picture for user with id {}", id);
        pictureRepository.save(pictureEntity);
    }

    private void validateUser(int id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with id " + id + " does not exist");
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

    public void deletePicture(int id) {
        Optional<PictureEntity> picture = pictureRepository.findById(id);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with id " + id + " does not have a profile photo");
        }
        pictureRepository.deleteById(id);
    }

    @SneakyThrows
    public byte[] getPicture(int userId) {
        Optional<PictureEntity> pictureEntity = pictureRepository.findById(userId);
        if (pictureEntity.isEmpty()) {
            // Load the default image file into a byte[]
            byte[] defaultImage;
            defaultImage = Files.readAllBytes(Paths.get("user_management/src/main/resources/assets/images/default-user-icon-scaled.png"));

            // Use the default image to create a new PictureEntity
            PictureEntity defaultPictureEntity = new PictureEntity();
            defaultPictureEntity.savePicture(defaultImage, defaultImage, userId, "image/png");
            return defaultPictureEntity.getStoredPicture();
        } else
            return pictureEntity.get().getStoredPicture();
    }
}
