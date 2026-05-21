package bunte_app.techbal5.bunte_app.dashboard;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dashboard_menu_items")
public class DashboardMenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "menu_order", nullable = false)
    private int menuOrder;

    protected DashboardMenuItem() {
    }

    public DashboardMenuItem(String name, int menuOrder) {
        this.name = name;
        this.menuOrder = menuOrder;
    }

    public String getName() {
        return name;
    }

    public int getMenuOrder() {
        return menuOrder;
    }
}
