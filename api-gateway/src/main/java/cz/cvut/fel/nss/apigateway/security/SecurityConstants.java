package cz.cvut.fel.nss.apigateway.security;

public class SecurityConstants {
    public static final long ACCESS_TOKEN_EXPIRATION = 2 * 60 * 1000; // 15 minutes
    public static final int REFRESH_TOKEN_LENGTH = 32;
    public static final String JWT_SECRET = "VerySecretSecretStoredVerySecurelyInPlainTextThatHasToBeChangedToSomethingMoreSecureInProductionEnvironmentAndNeedsToBeLongToAvoidErrorsAndSecurityBreaches";
}
