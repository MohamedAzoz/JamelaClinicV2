import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { IdentityService } from '@core/services/identity-service';
import { ROLES } from '@shared/constants/roles.constants';
import { NavItem } from '@shared/models/nav-item';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {
  ADMIN_NAV_ITEMS,
  DOCTOR_NAV_ITEMS,
  RECEPTIONIST_NAV_ITEMS,
  ACCOUNTANT_NAV_ITEMS,
} from '@core/config/sideBar.config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [RouterLink, SvgIconComponent, FontAwesomeModule],
})
export class Dashboard {
  private readonly identityService = inject(IdentityService);

  protected readonly faDashboard = faTableCellsLarge;

  protected readonly userName = this.identityService.userName;
  protected readonly userRole = this.identityService.userRole;

  protected readonly roleLabel = computed(() => {
    switch (this.userRole()) {
      case ROLES.Admin:        return 'مدير النظام';
      case ROLES.Doctor:       return 'طبيب';
      case ROLES.Reception:    return 'موظف استقبال';
      case ROLES.Accountant:   return 'محاسب';
      default:                 return 'مستخدم';
    }
  });

  protected readonly navItems = computed<readonly NavItem[]>(() => {
    switch (this.userRole()) {
      case ROLES.Admin:      return ADMIN_NAV_ITEMS;
      case ROLES.Doctor:     return DOCTOR_NAV_ITEMS;
      case ROLES.Reception:  return RECEPTIONIST_NAV_ITEMS;
      case ROLES.Accountant: return ACCOUNTANT_NAV_ITEMS;
      default:               return [];
    }
  });

  /** Exclude the dashboard card itself from the grid */
  protected readonly featureCards = computed(() =>
    this.navItems().filter((item) => item.icon !== 'dashboard'),
  );
}
