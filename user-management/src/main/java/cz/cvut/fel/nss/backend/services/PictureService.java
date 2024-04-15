package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserRepository;
import cz.cvut.fel.nss.backend.entities.AccountState;
import cz.cvut.fel.nss.backend.entities.PictureEntity;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import cz.cvut.fel.nss.backend.exception.NotFoundException;
import cz.cvut.fel.nss.backend.exception.WrongFileException;
import cz.cvut.fel.nss.backend.repositories.PictureEntityRepository;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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
    public void addPicture(MultipartFile file, String username) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        if (file == null) {
            file = new MockMultipartFile("default-user-icon-scaled.png", new FileInputStream("user-management/src/main/resources/assets/images/default-user-icon-scaled.png"));
        } else {
            if (file.getSize() > maxProfilePhotoSize) {
                throw new WrongFileException("File is too big");
            }
            if (!"image/jpeg".equals(file.getContentType()) && !Objects.equals(file.getContentType(), "image/png")) {
                log.info("File content type: {}", file.getContentType());
                throw new WrongFileException("File is not a valid image format");
            }
        }
        PictureEntity pictureEntity = pictureRepository.findById(username).orElse(new PictureEntity());
        byte[] thumbnail = imageResizingService.createThumbnail(file.getBytes());
        pictureEntity.savePicture(file.getBytes(), thumbnail, username, file.getContentType());
        pictureRepository.save(pictureEntity);
    }

    public void deletePicture(String username) {
        Optional<PictureEntity> picture = pictureRepository.findById(username);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with username " + username + " does not have a profile photo");
        }
        pictureRepository.deleteById(username);
    }

    public byte[] getPicture(String username) {
        Optional<PictureEntity> picture = pictureRepository.findById(username);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with username " + username + " does not have a profile photo");
        }
        return picture.get().getStoredPicture();
    }
}
