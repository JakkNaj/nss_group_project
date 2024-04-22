package cz.cvut.fel.nss.searchentities.services;

import cz.cvut.fel.nss.user_management.entities.UserEntity;
import cz.cvut.fel.nss.searchentities.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class UserSearchService {
    private final UserRepository userRepository;

    @Autowired
    public UserSearchService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Cacheable(value = "users", key = "{#username, #page, #size}")
    public Page<UserEntity> searchUsers(String username, int page, int size) {
        return userRepository.findAllByUsernameContaining(username, PageRequest.of(page, size));
    }
}
