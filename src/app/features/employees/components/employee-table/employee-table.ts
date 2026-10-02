import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserTie,
  faPen,
  faTrashCan,
  faCircleCheck,
  faCircleXmark,
  faUserPlus,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeFacade } from '../../services/employee.facade';
import { Employee } from '@features/employees/models/Employee';

@Component({
  selector: 'app-employee-table',
  imports: [FontAwesomeModule],
  templateUrl: './employee-table.html',
})
export class EmployeeTableComponent {
  public facade = inject(EmployeeFacade);

  readonly faUserTie = faUserTie;
  readonly faPen = faPen;
  readonly faTrashCan = faTrashCan;
  readonly faCircleCheck = faCircleCheck;
  readonly faCircleXmark = faCircleXmark;
  readonly faUserPlus = faUserPlus;
  readonly faHashtag = faHashtag;
  toggleStatus(employee: Employee): void {
    this.facade.toggleEmployeeStatus(employee.userId);
  }
}
