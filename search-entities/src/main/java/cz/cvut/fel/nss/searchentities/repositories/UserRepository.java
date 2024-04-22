package cz.cvut.fel.nss.searchentities.repositories;

import cz.cvut.fel.nss.user_management.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, Integer> {
    Page<UserEntity> findAllByUsernameContaining(String username, Pageable pageable);
}
