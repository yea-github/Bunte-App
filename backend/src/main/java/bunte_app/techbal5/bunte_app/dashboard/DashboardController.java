package bunte_app.techbal5.bunte_app.dashboard;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardMenuItemRepository repository;

    public DashboardController(DashboardMenuItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/dashboard")
    public List<MenuItem> dashboard() {
        return repository.findAllByOrderByMenuOrderAsc()
                .stream()
                .map(menuItem -> new MenuItem(menuItem.getName()))
                .toList();
    }
}
