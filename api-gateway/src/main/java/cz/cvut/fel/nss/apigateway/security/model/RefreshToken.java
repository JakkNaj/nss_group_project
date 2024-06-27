package cz.cvut.fel.nss.apigateway.security.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class RefreshToken {
    @Id
    private String token;
}
