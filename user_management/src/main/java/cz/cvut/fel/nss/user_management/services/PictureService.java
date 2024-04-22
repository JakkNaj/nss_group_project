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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class PictureService {
    @Autowired
    private PictureEntityRepository pictureRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageResizingService imageResizingService;

    @Value("${profilephoto.max.size}")
    private int maxProfilePhotoSize;

    @SneakyThrows
    public void addPicture(MultipartFile file, int id) {
        validateUser(id);
        file = validateAndPrepareFile(file);
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
    private MultipartFile validateAndPrepareFile(MultipartFile file) {
        if (file == null) {
            return new MockMultipartFile("default-user-icon-scaled.png", new FileInputStream("user-management/src/main/resources/assets/images/default-user-icon-scaled.png"));
        } else {
            if (file.getSize() > maxProfilePhotoSize) {
                throw new WrongFileException("File is too big");
            }
            if (!"image/jpeg".equals(file.getContentType()) && !Objects.equals(file.getContentType(), "image/png")) {
                log.info("File content type: {}", file.getContentType());
                throw new WrongFileException("File is not a valid image format");
            }
        }
        return file;
    }

    public void deletePicture(int id) {
        Optional<PictureEntity> picture = pictureRepository.findById(id);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with id " + id + " does not have a profile photo");
        }
        pictureRepository.deleteById(id);
    }

    public byte[] getPicture(int id) {
        Optional<PictureEntity> picture = pictureRepository.findById(id);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with id " + id + " does not have a profile photo");
        }
        return picture.get().getStoredPicture();
    }
}
