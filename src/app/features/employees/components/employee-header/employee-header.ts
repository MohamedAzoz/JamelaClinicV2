import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserTie,
  faUserPlus,
  faRotateRight,
  faMagnifyingGlass,
  faXmark,
  faCheckCircle,
  faBan,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeFacade } from '../../services/employee.facade';

@Component({
  selector: 'app-employee-header',
  imports: [FontAwesomeModule],
  templateUrl: './employee-header.html',
})
export class EmployeeHeaderComponent {
  public facade = inject(EmployeeFacade);

  readonly faUserTie = faUserTie;
  readonly faUserPlus = faUserPlus;
  readonly faRotateRight = faRotateRight;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faXmark = faXmark;
  readonly faCheckCircle = faCheckCircle;
  readonly faBan = faBan;
  readonly faUsers = faUsers;

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.setSearchTerm(input.value);
  }

  clearSearch(): void {
    this.facade.setSearchTerm('');
  }
}
