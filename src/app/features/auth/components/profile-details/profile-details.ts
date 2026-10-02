import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faAddressCard,
  faShieldHalved,
  faCircleCheck,
  faKey,
  faRightFromBracket,
  faHospital,
  faStethoscope,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { IdentityService } from '@core/services/identity-service';

@Component({
  selector: 'app-profile-details',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './profile-details.html',
})
export class ProfileDetailsComponent {
  public facade = inject(AuthFacade);
  public identity = inject(IdentityService);

  readonly faUser = faUser;
  readonly faAddressCard = faAddressCard;
  readonly faShieldHalved = faShieldHalved;
  readonly faCircleCheck = faCircleCheck;
  readonly faKey = faKey;
  readonly faRightFromBracket = faRightFromBracket;
  readonly faHospital = faHospital;
  readonly faStethoscope = faStethoscope;
  readonly faUserGear = faUserGear;

  logout(): void {
    this.facade.logout();
  }
}
