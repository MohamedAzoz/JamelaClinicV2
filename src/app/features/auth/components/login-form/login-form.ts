import { Component, input, output, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { LoginRequest } from '../../models/LoginRequest';

interface LoginFormModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  imports: [FormField, FormRoot, FontAwesomeModule],
})
export class LoginFormComponent {
  readonly isLoading = input(false);
  readonly submitted = output<LoginRequest>();

  readonly showPassword = signal(false);

  // FontAwesome Icons
  readonly faUser = faUser;
  readonly faLock = faLock;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faRightToBracket = faRightToBracket;
  readonly faSpinner = faSpinner;

  private readonly _model = signal<LoginFormModel>({
    username: '',
    password: '',
  });

  readonly loginForm = form(this._model, (path) => {
    required(path.username, { message: 'اسم المستخدم مطلوب' });
    required(path.password, { message: 'كلمة المرور مطلوبة' });
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    const value = this._model();
    this.submitted.emit({ username: value.username, password: value.password });
  }
}
