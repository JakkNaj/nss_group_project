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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Value("${profilephoto.max.size}")
    private int maxProfilePhotoSize;

    @SneakyThrows
    public void addPicture(MultipartFile file, String username) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isEmpty() || user.get().getAccountState() == AccountState.DELETED) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        if (file.getSize() > maxProfilePhotoSize) {
            throw new WrongFileException("File is too big");
        }
        if (!"image/jpeg".equals(file.getContentType()) && !Objects.equals(file.getContentType(), "image/png")) {
            log.info("File content type: {}", file.getContentType());
            throw new WrongFileException("File is not an image");
        }
        PictureEntity pictureEntity = pictureRepository.findById(username).orElse(new PictureEntity());
        pictureEntity.savePicture(file.getBytes(), username, file.getContentType());
        pictureRepository.save(pictureEntity);
    }

    public void deletePicture(String username) {
        Optional<PictureEntity> picture = pictureRepository.findById(username);
        if (picture.isEmpty()) {
            throw new NotFoundException("User with username " + username + " does not have a profile photo");
        }
        pictureRepository.deleteById(username);
    }
}
