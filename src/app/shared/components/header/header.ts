import { Component, signal, output, inject, computed } from '@angular/core';
import { IdentityService } from '@core/services/identity-service';
import { AuthFacade } from '@features/auth/services/auth.facade';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faUser,
  faCog,
  faSignOut,
  faBell,
  faAngleDown,
  faAngleUp,
  faSun,
  faMoon,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@core/services/theme';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FontAwesomeModule],

  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly isUserMenuOpen = signal(false);
  protected readonly idntity = inject(IdentityService);
  private readonly authFacade = inject(AuthFacade);
  readonly theme = inject(Theme);

  readonly faBars = faBars;
  readonly faAngleDown = faAngleDown;
  readonly faAngleUp = faAngleUp;
  readonly faUser = faUser;
  readonly faCog = faCog;
  readonly faSignOut = faSignOut;
  readonly faBell = faBell;

  readonly faSun = faSun;
  readonly faMoon = faMoon;
  readonly faGlobe = faGlobe;

  /** Emits to toggle the mobile sidebar */
  readonly toggleMobileSidebar = output<void>();
  logout() {
    this.authFacade.logout();
  }
  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }
  readonly isDark = this.theme.isDark;
  readonly desktopThemeLabel = computed(() => (this.isDark() ? 'Light' : 'Dark'));
  readonly themeLabel = computed(() =>
    this.isDark() ? 'Switch to light mode' : 'Switch to dark mode',
  );

  protected toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
    // if (this.isUserMenuOpen()) {
    //   this.isNotificationsOpen.set(false);
    // }
  }

  protected getTimeDisplay(createdAt: Date | string): string {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 3600));

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  }

  protected closeAllMenus(): void {
    this.isUserMenuOpen.set(false);
  }
}
