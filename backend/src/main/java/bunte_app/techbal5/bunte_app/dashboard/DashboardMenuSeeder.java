package bunte_app.techbal5.bunte_app.dashboard;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DashboardMenuSeeder implements CommandLineRunner {

    private static final List<String> DEFAULT_MENU_ITEMS = List.of(
            "Users and Roles",
            "CRM",
            "Sales",
            "Purchases",
            "Inventory",
            "Production",
            "Finance",
            "HR & Payroll",
            "Assets",
            "Project Management",
            "Qualiy Management",
            "Settings",
            "System");

    private final DashboardMenuItemRepository repository;

    public DashboardMenuSeeder(DashboardMenuItemRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        for (int index = 0; index < DEFAULT_MENU_ITEMS.size(); index++) {
            String name = DEFAULT_MENU_ITEMS.get(index);

            if (!repository.existsByName(name)) {
                repository.save(new DashboardMenuItem(name, index + 1));
            }
        }
    }
}
