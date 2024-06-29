package cz.cvut.fel.nss.apigateway.security.dto;

import cz.cvut.fel.nss.user_management.entities.UserEntity;
import lombok.Getter;

@Getter
public class AuthUserResponseDto extends AuthResponseDto{

    private final UserEntityDto user;

    public AuthUserResponseDto(String accessToken, UserEntity user) {
        super(accessToken);
        // don't want to send account state or password to UNSAFE FRONTEND
        this.user = new UserEntityDto(user);
    }
}
