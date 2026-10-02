import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleExclamation,
  faHospital,
  faUserGroup,
  faChartPie,
  faNotesMedical,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { LoginFormComponent } from '../../components/login-form/login-form';
import { LoginRequest } from '../../models/LoginRequest';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [LoginFormComponent, FontAwesomeModule, NgOptimizedImage],
  providers: [AuthFacade],
})
export class LoginPage {
  protected readonly facade = inject(AuthFacade);

  // FontAwesome Icons
  readonly faCircleExclamation = faCircleExclamation;
  readonly faHospital = faHospital;
  readonly faUserGroup = faUserGroup;
  readonly faChartPie = faChartPie;
  readonly faNotesMedical = faNotesMedical;

  onFormSubmitted(request: LoginRequest): void {
    void this.facade.login(request);
  }
}
