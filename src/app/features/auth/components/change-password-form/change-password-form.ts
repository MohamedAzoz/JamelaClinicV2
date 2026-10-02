import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faEye,
  faEyeSlash,
  faCheck,
  faSpinner,
  faShieldHalved,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { ChangePasswordRequest } from '../../models/ChangePasswordRequest';

interface ChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-change-password-form',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './change-password-form.html',
})
export class ChangePasswordFormComponent {
  public facade = inject(AuthFacade);

  readonly faLock = faLock;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faShieldHalved = faShieldHalved;
  readonly faCircleCheck = faCircleCheck;

  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);
  success = signal(false);

  private readonly _model = signal<ChangePasswordModel>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  readonly passwordForm = form(this._model, (path) => {
    required(path.currentPassword, { message: 'يرجى إدخال كلمة المرور الحالية' });
    minLength(path.currentPassword, 6, { message: 'كلمة المرور الحالية قصيرة جداً' });

    required(path.newPassword, { message: 'يرجى إدخال كلمة المرور الجديدة' });
    minLength(path.newPassword, 8, { message: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' });
    validate(path.newPassword, (ctx) => {
      if (ctx.value() && ctx.value() === this._model().currentPassword) {
        return { kind: 'samePrevious', message: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية' };
      }
      return null;
    });

    required(path.confirmPassword, { message: 'يرجى تأكيد كلمة المرور الجديدة' });
    validate(path.confirmPassword, (ctx) => {
      if (ctx.value() && ctx.value() !== this._model().newPassword) {
        return { kind: 'passwordMismatch', message: 'كلمتا المرور غير متطابقتين' };
      }
      return null;
    });
  });

  async onSubmit(event?: Event): Promise<void> {
    if (event) event.preventDefault();
    if (this.passwordForm().invalid() || this.facade.changePasswordLoading()) {
      this.passwordForm().markAsTouched();
      return;
    }

    const value = this._model();
    const request: ChangePasswordRequest = {
      currentPassword: value.currentPassword,
      newPassword: value.newPassword,
    };

    const ok = await this.facade.changePassword(request);

    if (ok) {
      this.success.set(true);
      this._model.set({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }

  toggleField(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') this.showCurrent.update((v) => !v);
    if (field === 'new') this.showNew.update((v) => !v);
    if (field === 'confirm') this.showConfirm.update((v) => !v);
  }
}

