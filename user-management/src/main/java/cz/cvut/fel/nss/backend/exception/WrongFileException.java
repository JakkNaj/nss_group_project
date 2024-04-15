package cz.cvut.fel.nss.backend.exception;

public class WrongFileException extends RuntimeException {
    public WrongFileException(String message) {
        super(message);
    }
}
