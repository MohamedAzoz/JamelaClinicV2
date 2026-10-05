import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormField, FormRoot } from '@angular/forms/signals';
import {
  faPlus,
  faHospital,
  faPercent,
  faCircleXmark,
  faSpinner,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';

@Component({
  selector: 'app-doctor-clinic-assign-modal',
  imports: [FontAwesomeModule, FormField, FormRoot],
  templateUrl: './doctor-clinic-assign-modal.html',
})
export class DoctorClinicAssignModalComponent {
  public facade = inject(DoctorClinicsFacade);

  readonly faPlus = faPlus;
  readonly faHospital = faHospital;
  readonly faPercent = faPercent;
  readonly faCircleXmark = faCircleXmark;
  readonly faSpinner = faSpinner;
  readonly faCheck = faCheck;
}
