package cz.cvut.fel.nss.backend.dao;

import cz.cvut.fel.nss.backend.entities.PictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PictureRepository extends JpaRepository<PictureEntity, Integer> {
    PictureEntity findByUserEntity_Username(String username);
}
