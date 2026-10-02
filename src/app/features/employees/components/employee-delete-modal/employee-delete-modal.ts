import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { EmployeeFacade } from '../../services/employee.facade';

@Component({
  selector: 'app-employee-delete-modal',
  imports: [ConfirmModalComponent],
  templateUrl: './employee-delete-modal.html',
})
export class EmployeeDeleteModalComponent {
  public facade = inject(EmployeeFacade);

  confirm(): void {
    this.facade.confirmDelete();
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
