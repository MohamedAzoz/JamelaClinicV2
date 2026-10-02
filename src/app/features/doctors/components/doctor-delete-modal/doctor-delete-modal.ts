import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { DoctorFacade } from '../../services/doctor.facade';

@Component({
  selector: 'app-doctor-delete-modal',
  imports: [ConfirmModalComponent],
  templateUrl: './doctor-delete-modal.html',
})
export class DoctorDeleteModalComponent {
  public facade = inject(DoctorFacade);

  confirm(): void {
    this.facade.confirmDelete();
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
