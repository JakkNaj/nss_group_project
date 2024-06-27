package cz.cvut.fel.nss.apigateway.security.repository;

import cz.cvut.fel.nss.apigateway.security.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
}
