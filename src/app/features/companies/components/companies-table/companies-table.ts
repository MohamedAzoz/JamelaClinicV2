import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faReceipt,
  faBuilding,
  faPhone,
  faBoxesPacking,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import { Company } from '../../models/Company';

@Component({
  selector: 'app-companies-table',
  imports: [FontAwesomeModule],
  templateUrl: './companies-table.html',
})
export class CompaniesTableComponent {
  companies = input.required<Company[]>();
  loading = input<boolean>(false);

  // Output Events
  editCompany = output<Company>();
  deleteCompany = output<Company>();
  viewCompanyOrders = output<Company>();

  // Font Awesome Icons
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faReceipt = faReceipt;
  faBuilding = faBuilding;
  faPhone = faPhone;
  faBoxesPacking = faBoxesPacking;
  faInbox = faInbox;
}
