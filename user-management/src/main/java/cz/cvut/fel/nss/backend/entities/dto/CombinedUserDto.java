package cz.cvut.fel.nss.backend.entities.dto;

import cz.cvut.fel.nss.backend.entities.AccountState;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CombinedUserDto {
    private int id;
    private String username;
    private String name;
    private AccountState accountState;
    private String email;
    private String phone;
    private String address;
    private String birthdate;
    private String dateCreated;
    private String thumbnail;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("CombinedUserDto{");
        sb.append("username='").append(username).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", accountState=").append(accountState);
        sb.append(", email='").append(email).append('\'');
        sb.append(", phone='").append(phone).append('\'');
        sb.append(", address='").append(address).append('\'');
        sb.append(", birthdate='").append(birthdate).append('\'');
        sb.append(", dateCreated='").append(dateCreated).append('\'');
        sb.append(", thumbnail='").append(thumbnail).append('\'');
        sb.append(", id='").append(id).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
