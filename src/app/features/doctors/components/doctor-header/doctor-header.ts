import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUserMd,
  faUserPlus,
  faRotateRight,
  faMagnifyingGlass,
  faXmark,
  faCheckCircle,
  faBan,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { DoctorFacade } from '../../services/doctor.facade';

@Component({
  selector: 'app-doctor-header',
  imports: [FontAwesomeModule],
  templateUrl: './doctor-header.html',
})
export class DoctorHeaderComponent {
  public facade = inject(DoctorFacade);

  readonly faUserMd = faUserMd;
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
