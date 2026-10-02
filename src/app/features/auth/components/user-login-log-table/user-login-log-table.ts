import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faClock,
  faDesktop,
  faShieldHalved,
  faCircleCheck,
  faCircleXmark,
  faSpinner,
  faAngleRight,
  faAngleLeft,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { PaginationComponent } from '@shared/components/pagination';

@Component({
  selector: 'app-user-login-log-table',
  imports: [DatePipe, FontAwesomeModule, PaginationComponent],
  templateUrl: './user-login-log-table.html',
})
export class UserLoginLogTableComponent {
  public facade = inject(AuthFacade);

  readonly faUser = faUser;
  readonly faClock = faClock;
  readonly faDesktop = faDesktop;
  readonly faShieldHalved = faShieldHalved;
  readonly faCircleCheck = faCircleCheck;
  readonly faCircleXmark = faCircleXmark;
  readonly faSpinner = faSpinner;
  readonly faAngleRight = faAngleRight;
  readonly faAngleLeft = faAngleLeft;
  readonly faTriangleExclamation = faTriangleExclamation;

  nextPage(): void {
    this.facade.nextLoginLogsPage();
  }

  prevPage(): void {
    this.facade.previousLoginLogsPage();
  }
}
