package bunte_app.techbal5.bunte_app.auth;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringJoiner;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class KeycloakLoginService {

    private final HttpClient httpClient;
    private final KeycloakProperties keycloakProperties;

    public KeycloakLoginService(KeycloakProperties keycloakProperties) {
        this.httpClient = HttpClient.newHttpClient();
        this.keycloakProperties = keycloakProperties;
    }

    public ResponseEntity<String> login(LoginRequest loginRequest) throws IOException, InterruptedException {
        Map<String, String> formData = new LinkedHashMap<>();
        formData.put("grant_type", "password");
        formData.put("client_id", keycloakProperties.clientId());
        formData.put("username", loginRequest.username());
        formData.put("password", loginRequest.password());

        if (StringUtils.hasText(keycloakProperties.clientSecret())) {
            formData.put("client_secret", keycloakProperties.clientSecret());
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(keycloakProperties.tokenUri()))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(encodeForm(formData)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(response.statusCode()))
                .contentType(MediaType.APPLICATION_JSON)
                .body(response.body());
    }

    private String encodeForm(Map<String, String> formData) {
        StringJoiner joiner = new StringJoiner("&");
        formData.forEach((key, value) -> joiner.add(encode(key) + "=" + encode(value)));
        return joiner.toString();
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
