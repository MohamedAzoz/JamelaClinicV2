import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form';

@Component({
  selector: 'app-change-password',
  imports: [FontAwesomeModule, ChangePasswordFormComponent],
  templateUrl: './change-password.html',
})
export class ChangePasswordPage {
  readonly faShieldHalved = faShieldHalved;
}
