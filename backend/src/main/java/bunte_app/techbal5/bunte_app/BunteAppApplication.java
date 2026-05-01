package bunte_app.techbal5.bunte_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BunteAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(BunteAppApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello() {
		return "Hello World. This is a simple Spring Boot application.The name of this application is Bunte App.";
	}

	@GetMapping("/api/stuttgart")
	public String stuttgart() {
		return "This is Stuttgart city. It is the capital of the state of Baden-Württemberg in souther Germany.";
	}

}
