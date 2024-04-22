package cz.cvut.fel.nss.user_management.repositories;

import cz.cvut.fel.nss.user_management.entities.PictureEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PictureEntityRepository extends MongoRepository<PictureEntity, Integer> {
}
