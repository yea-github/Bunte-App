package bunte_app.techbal5.bunte_app.auth;

import java.io.IOException;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    private final KeycloakLoginService keycloakLoginService;

    public LoginController(KeycloakLoginService keycloakLoginService) {
        this.keycloakLoginService = keycloakLoginService;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            return keycloakLoginService.login(loginRequest);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "login_interrupted"));
        } catch (IOException exception) {
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "keycloak_unreachable"));
        }
    }
}
