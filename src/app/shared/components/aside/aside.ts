import { Component, signal, computed, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HospitalName } from '@shared/constants/app-routes.constants';
import { NavItem } from '@shared/models/nav-item';
import { IdentityService } from '@core/services/identity-service';
import { Theme } from '@core/services/theme';
import {
  ADMIN_NAV_ITEMS,
  DOCTOR_NAV_ITEMS,
  ACCOUNTANT_NAV_ITEMS,
  RECEPTIONIST_NAV_ITEMS,
} from '@core/config/sideBar.config';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { NgOptimizedImage } from '@angular/common';
import { ROLES } from '@shared/constants/roles.constants';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-aside',
  imports: [RouterLink, RouterLinkActive, SvgIconComponent, FontAwesomeModule, NgOptimizedImage],

  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  private readonly identityService = inject(IdentityService);
  private readonly theme = inject(Theme);

  protected readonly hospitalName = HospitalName;
  protected readonly isCollapsed = signal(false);
  protected readonly sidebarWidth = computed(() => (this.isCollapsed() ? 'collapsed' : 'expanded'));

  /** Reactive logo — switches between light and dark variant based on the active theme signal */
  protected readonly logoSrc = computed(
    () =>
      // this.theme.isDark() ? '/jamela.webp' : '/Logo.webp',
      '/jamela.webp',
  );

  protected readonly faClose = faX;
  protected readonly faAngleLeft = faAngleLeft;
  /** Emits when mobile overlay sidebar should close */
  readonly closeMobileSidebar = output<void>();

  protected readonly navItems = computed<readonly NavItem[]>(() => {
    const role = this.identityService.userRole();
    switch (role) {
      case ROLES.Admin:
        return ADMIN_NAV_ITEMS;
      case ROLES.Doctor:
        return DOCTOR_NAV_ITEMS;
      case ROLES.Reception:
        return RECEPTIONIST_NAV_ITEMS;
      case ROLES.Accountant:
        return ACCOUNTANT_NAV_ITEMS;
      default:
        return [];
    }
  });

  protected toggleSidebar(): void {
    this.isCollapsed.update((v) => !v);
  }

  protected onNavItemClick(): void {
    this.closeMobileSidebar.emit();
  }
}
