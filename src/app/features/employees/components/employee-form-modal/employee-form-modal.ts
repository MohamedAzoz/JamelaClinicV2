import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserTie,
  faXmark,
  faCheck,
  faSpinner,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeFacade } from '../../services/employee.facade';
import { UpdateEmployee } from '../../models/UpdateEmployee';
import { RegisterEmployeeRequest } from '@features/auth/models/RegisterEmployee';
import { ROLES } from '@shared/constants/roles.constants';

interface EmployeeFormModel {
  fullName: string;
  username: string;
  password: string;
  roleName: 'Accountant' | 'Reception';
  isActive: boolean;
}

@Component({
  selector: 'app-employee-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './employee-form-modal.html',
})
export class EmployeeFormModalComponent {
  public facade = inject(EmployeeFacade);

  readonly faUserTie = faUserTie;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faLock = faLock;
  readonly faUser = faUser;

  private readonly _model = signal<EmployeeFormModel>({
    fullName: '',
    username: '',
    password: '',
    roleName: ROLES.Reception,
    isActive: true,
  });

  readonly employeeForm = form(this._model, (path) => {
    required(path.fullName, { message: 'الاسم الكامل مطلوب' });
    minLength(path.fullName, 3, { message: 'يجب أن يكون الاسم 3 أحرف على الأقل' });

    required(path.roleName, {
      when: () => !this.facade.selectedEmployee(),
      message: 'نوع الحساب مطلوب',
    });

    required(path.username, {
      when: () => !this.facade.selectedEmployee(),
      message: 'اسم المستخدم مطلوب',
    });
    minLength(path.username, 3, {
      when: () => !this.facade.selectedEmployee(),
      message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل',
    });

    required(path.password, {
      when: () => !this.facade.selectedEmployee(),
      message: 'كلمة المرور مطلوبة',
    });
    minLength(path.password, 6, {
      when: () => !this.facade.selectedEmployee(),
      message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    });
  });

  constructor() {
    effect(() => {
      const selected = this.facade.selectedEmployee();
      if (selected) {
        this._model.set({
          fullName: selected.fullName,
          username: '',
          password: '',
          roleName: ROLES.Reception,
          isActive: selected.isActive,
        });
      } else {
        this._model.set({
          fullName: '',
          username: '',
          password: '',
          roleName: ROLES.Reception,
          isActive: true,
        });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.employeeForm().invalid()) {
      this.employeeForm().markAsTouched();
      return;
    }

    const selected = this.facade.selectedEmployee();
    const val = this._model();

    if (selected) {
      const request: UpdateEmployee = {
        userId: selected.userId,
        fullName: val.fullName,
        isActive: val.isActive,
      };
      this.facade.updateEmployee(request);
    } else {
      const request: RegisterEmployeeRequest = {
        fullName: val.fullName,
        username: val.username,
        password: val.password,
        roleName: val.roleName,
      };
      this.facade.registerEmployee(request);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
