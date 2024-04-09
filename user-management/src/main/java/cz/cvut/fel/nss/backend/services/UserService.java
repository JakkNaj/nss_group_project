package cz.cvut.fel.nss.backend.services;

import cz.cvut.fel.nss.backend.dao.UserDao;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserDao userDao;

    @Autowired
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Transactional(readOnly = true)
    public UserEntity findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Transactional
    public void create(UserEntity user) {
        userDao.persist(user);
    }

    @Transactional
    public void update(UserEntity user) {
        userDao.update(user);
    }

    @Transactional
    public void delete(UserEntity user) {
        // delete user
    }
}
