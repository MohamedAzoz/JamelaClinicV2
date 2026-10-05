import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';

@Component({
  selector: 'app-doctor-clinic-delete-modal',
  imports: [FontAwesomeModule],
  templateUrl: './doctor-clinic-delete-modal.html',
})
export class DoctorClinicDeleteModalComponent {
  public facade = inject(DoctorClinicsFacade);

  readonly faTrashCan = faTrashCan;
  readonly faSpinner = faSpinner;
}
