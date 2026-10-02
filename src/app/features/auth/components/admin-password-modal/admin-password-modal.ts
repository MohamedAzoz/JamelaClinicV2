import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faEye,
  faEyeSlash,
  faKey,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { AdminChangePasswordRequest } from '../../models/AdminChangePasswordRequest';

interface AdminPasswordModel {
  newPassword: string;
}

@Component({
  selector: 'app-admin-password-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './admin-password-modal.html',
})
export class AdminPasswordModalComponent {
  readonly facade = inject(AuthFacade);
  readonly faCheck = faCheck;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faKey = faKey;
  readonly faSpinner = faSpinner;
  readonly faXmark = faXmark;
  readonly showPassword = signal(false);
  private readonly model = signal<AdminPasswordModel>({ newPassword: '' });
  readonly passwordForm = form(this.model, (path) => {
    required(path.newPassword, { message: 'كلمة المرور الجديدة مطلوبة' });
    minLength(path.newPassword, 8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
  });

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.passwordForm().invalid() || this.facade.adminPasswordLoading()) {
      this.passwordForm().markAsTouched();
      return;
    }

    const user = this.facade.selectedManagedUser();
    if (!user) return;

    const request: AdminChangePasswordRequest = {
      targetUserId: user.userId,
      newPassword: this.model().newPassword,
    };
    const success = await this.facade.adminChangePassword(request);
    if (success) {
      this.model.set({ newPassword: '' });
      this.showPassword.set(false);
      this.facade.closeAdminPasswordModal();
    }
  }

  close(): void {
    this.model.set({ newPassword: '' });
    this.showPassword.set(false);
    this.facade.closeAdminPasswordModal();
  }
}
