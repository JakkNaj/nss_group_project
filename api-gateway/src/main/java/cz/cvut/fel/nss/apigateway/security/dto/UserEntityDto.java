package cz.cvut.fel.nss.apigateway.security.dto;

import cz.cvut.fel.nss.user_management.entities.UserEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserEntityDto {
    private int userId;
    private String username;
    private String name;
    private String email;

    public UserEntityDto(UserEntity userEntity) {
        this.userId = userEntity.getUserId();
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        this.email = userEntity.getEmail();
    }
}
