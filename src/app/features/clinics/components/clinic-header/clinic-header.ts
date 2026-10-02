import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHospital,
  faPlus,
  faRotateRight,
  faMagnifyingGlass,
  faXmark,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ClinicFacade } from '../../services/clinic.facade';

@Component({
  selector: 'app-clinic-header',
  imports: [FontAwesomeModule],
  templateUrl: './clinic-header.html',
})
export class ClinicHeaderComponent {
  public facade = inject(ClinicFacade);

  readonly faHospital = faHospital;
  readonly faPlus = faPlus;
  readonly faRotateRight = faRotateRight;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faXmark = faXmark;
  readonly faTrash = faTrash;

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.setSearchTerm(input.value);
  }

  clearSearch(): void {
    this.facade.setSearchTerm('');
  }
}
