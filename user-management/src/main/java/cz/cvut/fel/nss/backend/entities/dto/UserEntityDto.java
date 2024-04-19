package cz.cvut.fel.nss.backend.entities.dto;

import cz.cvut.fel.nss.backend.entities.AccountState;
import cz.cvut.fel.nss.backend.entities.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserEntityDto {
    private int id;
    private String name;
    private AccountState accountState;
    private String password;

    public UserEntityDto(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.name = userEntity.getName();
        this.accountState = userEntity.getAccountState();
    }
}
