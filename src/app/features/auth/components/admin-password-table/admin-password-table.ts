import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faKey,
  faRotateRight,
  faSpinner,
  faUser,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-admin-password-table',
  imports: [FontAwesomeModule],
  templateUrl: './admin-password-table.html',
})
export class AdminPasswordTableComponent {
  readonly facade = inject(AuthFacade);
  readonly faKey = faKey;
  readonly faRotateRight = faRotateRight;
  readonly faSpinner = faSpinner;
  readonly faUser = faUser;
  readonly faUserDoctor = faUserDoctor;

  reload(): void {
    void this.facade.loadManagedUsers();
  }
}
