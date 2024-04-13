package cz.cvut.fel.nss.backend.entities.dto;

import cz.cvut.fel.nss.backend.entities.UserEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserEntityDto {
    private String username;
    private String name;
    private boolean deleted;
    private String email;

    public UserEntityDto(UserEntity userEntity) {
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        this.deleted = userEntity.isDeleted();
        this.email = userEntity.getEmail();
    }
}
