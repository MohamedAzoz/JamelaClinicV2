import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormField, FormRoot } from '@angular/forms/signals';
import {
  faPen,
  faPercent,
  faCircleXmark,
  faSpinner,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';

@Component({
  selector: 'app-doctor-clinic-edit-modal',
  imports: [FontAwesomeModule, FormField, FormRoot],
  templateUrl: './doctor-clinic-edit-modal.html',
})
export class DoctorClinicEditModalComponent {
  public facade = inject(DoctorClinicsFacade);

  readonly faPen = faPen;
  readonly faPercent = faPercent;
  readonly faCircleXmark = faCircleXmark;
  readonly faSpinner = faSpinner;
  readonly faCheck = faCheck;
}
