import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBuilding,
  faPlus,
  faRotateRight,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CompaniesFacade } from '../../services/companies.facade';

@Component({
  selector: 'app-companies-header',
  imports: [FontAwesomeModule],
  templateUrl: './companies-header.html', 
})
export class CompaniesHeaderComponent {
  public facade = inject(CompaniesFacade);

  readonly faBuilding = faBuilding;
  readonly faPlus = faPlus;
  readonly faRotateRight = faRotateRight;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faXmark = faXmark;

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.facade.setSearchTerm(input.value);
  }

  clearSearch(): void {
    this.facade.setSearchTerm('');
  }
}
