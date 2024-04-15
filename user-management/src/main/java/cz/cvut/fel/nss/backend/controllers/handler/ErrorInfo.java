package cz.cvut.fel.nss.backend.controllers.handler;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfo {
    private String message;
    private String requestUri;

    @Override
    public String toString() { return "ErrorInfo{" + requestUri + ", message = " + message + "}"; }
}
