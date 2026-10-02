import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesFacade } from '../../services/companies.facade';
import { CompaniesHeaderComponent } from '../../components/companies-header/companies-header';
import { CompaniesTableComponent } from '../../components/companies-table/companies-table';
import { CompanyFormModalComponent } from '../../components/company-form-modal/company-form-modal';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal';
import { Company } from '../../models/Company';

@Component({
  selector: 'app-companies-management',
  imports: [
    CompaniesHeaderComponent,
    CompaniesTableComponent,
    CompanyFormModalComponent,
    ConfirmModalComponent,
  ],
  providers: [CompaniesFacade],
  templateUrl: './companies-management.html',
})
export class CompaniesManagementComponent implements OnInit {
  readonly facade = inject(CompaniesFacade);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.facade.loadCompanies();
  }

  onViewOrders(company: Company): void {
    this._router.navigate(['/main/companies', company.id, 'orders']);
  }
}
