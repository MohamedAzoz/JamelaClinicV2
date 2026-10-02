import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { ClinicFacade } from '../../services/clinic.facade';

@Component({
  selector: 'app-clinic-delete-modal',
  imports: [ConfirmModalComponent],
  templateUrl: './clinic-delete-modal.html',
})
export class ClinicDeleteModalComponent {
  public facade = inject(ClinicFacade);

  confirm(): void {
    this.facade.confirmDelete();
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
