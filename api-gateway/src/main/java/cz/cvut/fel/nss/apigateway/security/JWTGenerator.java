package cz.cvut.fel.nss.apigateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

import static cz.cvut.fel.nss.apigateway.security.SecurityConstants.JWT_EXPIRATION;
import static cz.cvut.fel.nss.apigateway.security.SecurityConstants.JWT_SECRET;

@Component
public class JWTGenerator {

    private final SecretKey secretKey = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());


    public String generateToken(Authentication authentication){
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromJWT(String token){
        // return claims from token
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }


    // todo resolve problem, unable to authenticate myself through this method
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT token is expired or invalid");
        }
    }

}
