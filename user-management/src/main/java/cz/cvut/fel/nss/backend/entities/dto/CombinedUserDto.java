package cz.cvut.fel.nss.backend.entities.dto;

import cz.cvut.fel.nss.backend.entities.AccountState;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CombinedUserDto {
    private String username;
    private String name;
    private AccountState accountState;
    private String email;
    private String phone;
    private String address;
    private String birthdate;
    private String accountCreated;
}
