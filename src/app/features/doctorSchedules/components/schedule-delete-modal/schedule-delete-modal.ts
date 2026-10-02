import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';

@Component({
  selector: 'app-schedule-delete-modal',
  imports: [ConfirmModalComponent],
  templateUrl: './schedule-delete-modal.html',
})
export class ScheduleDeleteModalComponent {
  public facade = inject(DoctorScheduleFacade);

  confirm(): void {
    this.facade.confirmDelete();
  }

  close(): void {
    this.facade.closeDeleteModal();
  }
}
