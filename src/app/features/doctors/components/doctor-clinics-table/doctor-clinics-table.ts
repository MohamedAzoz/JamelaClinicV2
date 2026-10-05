import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHospital,
  faSliders,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faTrashCan,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';

@Component({
  selector: 'app-doctor-clinics-table',
  imports: [FontAwesomeModule],
  templateUrl: './doctor-clinics-table.html',
})
export class DoctorClinicsTableComponent {
  public facade = inject(DoctorClinicsFacade);

  readonly faHospital = faHospital;
  readonly faSliders = faSliders;
  readonly faCircleCheck = faCircleCheck;
  readonly faCircleXmark = faCircleXmark;
  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;
  readonly faPlus = faPlus;
}
