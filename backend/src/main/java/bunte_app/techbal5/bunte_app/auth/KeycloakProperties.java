package bunte_app.techbal5.bunte_app.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "bunte-app.keycloak")
public record KeycloakProperties(
        String tokenUri,
        String clientId,
        String clientSecret
) {
}
