import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faKey, faUsers, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { AuthFacade, ManagedUserType } from '../../services/auth.facade';

@Component({
  selector: 'app-admin-password-nav',
  imports: [FontAwesomeModule],
  templateUrl: './admin-password-nav.html',
})
export class AdminPasswordNavComponent {
  readonly facade = inject(AuthFacade);
  readonly faKey = faKey;
  readonly faUsers = faUsers;
  readonly faUserDoctor = faUserDoctor;

  selectType(type: ManagedUserType): void {
    if (this.facade.managedUserType() === type) return;
    void this.facade.selectManagedUserType(type);
  }
}
