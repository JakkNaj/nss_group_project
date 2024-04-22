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
    private int id;
    private String name;
    private String username;
    private AccountState accountState;
    private String password;

    public UserEntityDto(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        this.accountState = userEntity.getAccountState();
    }
}
