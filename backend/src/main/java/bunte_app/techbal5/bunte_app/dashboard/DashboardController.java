package bunte_app.techbal5.bunte_app.dashboard;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("/dashboard")
    public List<MenuItem> dashboard() {
        return List.of(
                new MenuItem("CRM"),
                new MenuItem("Sales"),
                new MenuItem("Purchases"),
                new MenuItem("Inventory"),
                new MenuItem("Accounting"),
                new MenuItem("Reports"));
    }
}
