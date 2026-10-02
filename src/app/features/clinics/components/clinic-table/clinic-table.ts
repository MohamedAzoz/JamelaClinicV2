import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPen,
  faTrashCan,
  faHospital,
  faPlus,
  faCheck,
  faHashtag,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ClinicFacade } from '../../services/clinic.facade';
import { Clinic } from '../../models/Clinic';

@Component({
  selector: 'app-clinic-table',
  imports: [FontAwesomeModule],
  templateUrl: './clinic-table.html',
})
export class ClinicTableComponent {
  public facade = inject(ClinicFacade);

  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;
  readonly faHospital = faHospital;
  readonly faPlus = faPlus;
  readonly faCheck = faCheck;
  readonly faHashtag = faHashtag;
  readonly faCircleCheck = faCircleCheck;

  isItemSelected(clinic: Clinic): boolean {
    return this.facade.selectedClinicIds().has(clinic.id);
  }
}
