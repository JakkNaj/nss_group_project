package cz.cvut.fel.nss.backend.dao;

import cz.cvut.fel.nss.backend.entities.UserEntity;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao extends BaseDao<UserEntity> {
    public UserDao() {
        super(UserEntity.class);
    }
    public UserEntity findByUsername(String username) {
        try {
            return em.createNamedQuery("User.findByUsername", UserEntity.class).setParameter("username", username)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
