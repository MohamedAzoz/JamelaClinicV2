import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faShieldHalved,
  faKey,
  faRotateRight,
  faCircleCheck,
  faAt,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { IdentityService } from '@core/services/identity-service';

@Component({
  selector: 'app-profile-header',
  imports: [FontAwesomeModule],
  templateUrl: './profile-header.html',
})
export class ProfileHeaderComponent {
  public facade = inject(AuthFacade);
  public identity = inject(IdentityService);

  readonly faUser = faUser;
  readonly faShieldHalved = faShieldHalved;
  readonly faKey = faKey;
  readonly faRotateRight = faRotateRight;
  readonly faCircleCheck = faCircleCheck;
  readonly faAt = faAt;
  readonly faIdBadge = faIdBadge;

  refresh(): void {
    void this.facade.loadUserProfile();
  }
}
