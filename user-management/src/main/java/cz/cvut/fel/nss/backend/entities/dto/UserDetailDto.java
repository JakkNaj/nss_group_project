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

}
