package cz.cvut.fel.nss.backend.repositories;

import cz.cvut.fel.nss.backend.entities.UserDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends MongoRepository<UserDetail, String> {
    //Optional<UserDetail> findById(String username);
}
