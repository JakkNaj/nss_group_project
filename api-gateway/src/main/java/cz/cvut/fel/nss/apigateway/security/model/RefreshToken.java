package cz.cvut.fel.nss.apigateway.security.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Data
public class RefreshToken {
    @Id
    private String token;

    private LocalDateTime expiration;
}
