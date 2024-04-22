package cz.cvut.fel.nss.user_management.repositories;

import cz.cvut.fel.nss.user_management.entities.UserDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends MongoRepository<UserDetail, Integer> {
}
