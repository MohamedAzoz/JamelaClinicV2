import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faHospital,
  faCircleCheck,
  faBuildingColumns,
  faArrowRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';

@Component({
  selector: 'app-doctor-clinics-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './doctor-clinics-header.html',
})
export class DoctorClinicsHeaderComponent {
  public facade = inject(DoctorClinicsFacade);

  readonly faUserMd = faUserMd;
  readonly faHospital = faHospital;
  readonly faCircleCheck = faCircleCheck;
  readonly faBuildingColumns = faBuildingColumns;
  readonly faArrowRight = faArrowRight;
  readonly faPlus = faPlus;
}
