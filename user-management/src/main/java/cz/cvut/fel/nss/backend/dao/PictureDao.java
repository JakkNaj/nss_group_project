package cz.cvut.fel.nss.backend.dao;

import cz.cvut.fel.nss.backend.entities.PictureEntity;
import org.springframework.stereotype.Repository;

@Repository
public class PictureDao extends BaseDao<PictureEntity> {
    public PictureDao() {
        super(PictureEntity.class);
    }
}
