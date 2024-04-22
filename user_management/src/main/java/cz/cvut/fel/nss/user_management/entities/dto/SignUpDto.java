package cz.cvut.fel.nss.user_management.entities.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpDto {
    private String username;
    private String password;
    private String name;
    private String email;
}
