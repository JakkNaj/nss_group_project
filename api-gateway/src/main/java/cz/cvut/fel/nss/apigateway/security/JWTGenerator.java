package cz.cvut.fel.nss.apigateway.security;

import cz.cvut.fel.nss.apigateway.security.exception.InvalidTokenException;
import cz.cvut.fel.nss.apigateway.security.exception.TokenExpiredException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

import static cz.cvut.fel.nss.apigateway.security.SecurityConstants.*;

@Component
public class JWTGenerator {

    private final SecretKey secretKey = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());

    private final SecureRandom secureRandom = new SecureRandom();


    public String generateAccessToken(Authentication authentication){
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + ACCESS_TOKEN_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(){
        byte[] bytes = new byte[REFRESH_TOKEN_LENGTH];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String getUsernameFromJWT(String token){
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token).getPayload();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token is expired");
        } catch (MalformedJwtException e) {
            throw new InvalidTokenException("JWT token is invalid");
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT token is invalid");
        }
    }

    public String getUsernameFromExpiredJWT(String token) {
        try {
            // Parse the token without verifying the signature
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey) // Set your secret key here
                    .build()
                    .parseSignedClaims(token).getPayload();
            // Extract the subject (username)
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            // Handle if token is expired (optional)
            // You can choose to ignore this or handle it differently
            // For ignoring, simply return the subject if it's available
            return e.getClaims().getSubject();
        } catch (Exception e) {
            // Handle other exceptions as needed
            throw new InvalidTokenException("Invalid JWT token");
        }
    }

    public boolean validateAccessToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token is expired");
        } catch (MalformedJwtException e) {
            throw new InvalidTokenException("JWT token is invalid");
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT token is invalid");
        }
    }

    public boolean validateRefreshToken(String refreshToken) {
        // for test purpose
        return true;
        // todo
        /*// Assuming the refresh token is a SHA-256 hash of a random string
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedToken = digest.digest(refreshToken.getBytes());

            // Here you should retrieve the original refresh token from the database
            // and compare it with the hashedToken
            // For the sake of this example, let's assume the original token is stored in a variable called originalToken
            byte[] originalToken = new byte[0]; // Replace this with the actual original token

            return Arrays.equals(hashedToken, originalToken);
        } catch (NoSuchAlgorithmException e) {
            // Handle the exception
            return false;
        }*/
    }

}
