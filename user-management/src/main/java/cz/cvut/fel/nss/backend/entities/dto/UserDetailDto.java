package cz.cvut.fel.nss.backend.entities.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailDto {
    private String username;
    private String email;
    private String phone;
    private String address;
    private String birthdate;
    private String accountCreated;

    public UserDetailDto(String username, String email, String phone, String address, String birthdate, String accountCreated) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.birthdate = birthdate;
        this.accountCreated = accountCreated;
    }
}
