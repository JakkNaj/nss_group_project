package cz.cvut.fel.nss.user_management.entities.dto;

import cz.cvut.fel.nss.user_management.entities.AccountState;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserEntityDto {
    private int userId;
    private String name;
    private String username;
    private AccountState accountState;
    private String password;
    private String email;

    public UserEntityDto(UserEntity userEntity) {
        this.userId = userEntity.getUserId();
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        this.accountState = userEntity.getAccountState();
        this.email = userEntity.getEmail();
    }
}
