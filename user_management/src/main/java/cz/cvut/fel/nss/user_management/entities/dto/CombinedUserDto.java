package cz.cvut.fel.nss.user_management.entities.dto;

import cz.cvut.fel.nss.user_management.entities.AccountState;
import cz.cvut.fel.nss.user_management.entities.PhoneNumbers;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CombinedUserDto {
    private int userId;
    private String username;
    private String name;
    private AccountState accountState;
    private String email;
    private PhoneNumbers phones;
    private AddressDto address;
    private String birthdate;
    private String dateCreated;
    private String thumbnail;

    @Override
    public String toString() {
        return "CombinedUserDto{" + "userId=" + userId +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", accountState=" + accountState +
                ", email='" + email + '\'' +
                ", phones=" + phones +
                ", address='" + address + '\'' +
                ", birthdate='" + birthdate + '\'' +
                ", dateCreated='" + dateCreated + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                '}';
    }

    public CombinedUserDto(UserEntity userEntity) {
        this.userId = userEntity.getUserId();
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        this.accountState = userEntity.getAccountState();
        this.email = userEntity.getEmail();
    }
}
