package cz.cvut.fel.nss.apigateway.security.exception;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
