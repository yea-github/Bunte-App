package bunte_app.techbal5.bunte_app.dashboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardMenuItemRepository extends JpaRepository<DashboardMenuItem, Long> {

    boolean existsByName(String name);

    List<DashboardMenuItem> findAllByOrderByMenuOrderAsc();
}
