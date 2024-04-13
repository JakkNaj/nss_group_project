package cz.cvut.fel.nss.backend.entities.dto;

import cz.cvut.fel.nss.backend.entities.UserEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpDto {
    private String username;
    private String password;
    private String name;
    private boolean deleted;
    private String email;

    public SignUpDto(SignUpDto signUpDto) {
        this.username = signUpDto.getUsername();
        this.password = signUpDto.getPassword();
        this.name = signUpDto.getName();
        this.deleted = signUpDto.isDeleted();
        this.email = signUpDto.getEmail();
    }
}
