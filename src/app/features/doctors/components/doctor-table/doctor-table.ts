import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faHospital,
  faPen,
  faTrashCan,
  faCircleCheck,
  faCircleXmark,
  faPercent,
  faToggleOn,
  faToggleOff,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorFacade } from '../../services/doctor.facade';
import { Doctor } from '../../models/Doctor';

@Component({
  selector: 'app-doctor-table',
  imports: [FontAwesomeModule],
  templateUrl: './doctor-table.html',
})
export class DoctorTableComponent {
  public facade = inject(DoctorFacade);

  readonly faUserMd = faUserMd;
  readonly faHospital = faHospital;
  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;
  readonly faCircleCheck = faCircleCheck;
  readonly faCircleXmark = faCircleXmark;
  readonly faPercent = faPercent;
  readonly faToggleOn = faToggleOn;
  readonly faToggleOff = faToggleOff;
  readonly faUserPlus = faUserPlus;

  toggleStatus(doctor: Doctor): void {
    this.facade.toggleDoctorStatus(doctor.userId);
  }
}
