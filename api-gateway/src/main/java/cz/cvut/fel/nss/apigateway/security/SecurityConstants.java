package cz.cvut.fel.nss.apigateway.security;

public class SecurityConstants {
    public static final long JWT_EXPIRATION = 70000;
    public static final String JWT_SECRET = "VerySecretSecretStoredVerySecurelyInPlainTextThatHasToBeChangedToSomethingMoreSecureInProductionEnvironmentAndNeedsToBeLongToAvoidErrorsAndSecurityBreaches";
}
