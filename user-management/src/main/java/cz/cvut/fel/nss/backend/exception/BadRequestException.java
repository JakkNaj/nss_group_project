package cz.cvut.fel.nss.backend.exception;

public class BadRequestException extends EarException {
    public BadRequestException(String message) {
        super(message);
    }
}
