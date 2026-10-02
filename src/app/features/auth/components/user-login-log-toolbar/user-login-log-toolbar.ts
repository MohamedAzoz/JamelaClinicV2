import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClockRotateLeft,
  faMagnifyingGlass,
  faRotateRight,
  faUsers,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-user-login-log-toolbar',
  imports: [FontAwesomeModule],
  templateUrl: './user-login-log-toolbar.html',
})
export class UserLoginLogToolbarComponent {
  public facade = inject(AuthFacade);

  readonly faClockRotateLeft = faClockRotateLeft;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faRotateRight = faRotateRight;
  readonly faUsers = faUsers;
  readonly faCircleCheck = faCircleCheck;
  readonly faCircleXmark = faCircleXmark;

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.setLoginLogsSearchQuery(input.value);
  }

 

  refresh(): void {
    void this.facade.loadUserLoginLogs();
  }
}
