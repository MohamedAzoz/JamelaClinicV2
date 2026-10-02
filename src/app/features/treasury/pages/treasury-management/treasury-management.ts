import { Component, inject, OnInit } from '@angular/core';
import { TreasuryFacade } from '../../services/treasury.facade';
import { TreasuryHeaderComponent } from '../../components/treasury-header/treasury-header';
import { TreasuryFiltersComponent } from '../../components/treasury-filters/treasury-filters';
import { TreasurySummaryComponent } from '../../components/treasury-summary/treasury-summary';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table';
import { ExpenseFormModalComponent } from '../../components/expense-form-modal/expense-form-modal';
import { ExpenseDeleteModalComponent } from '../../components/expense-delete-modal/expense-delete-modal';
import { PaginationComponent } from '@shared/components/pagination';

@Component({
  selector: 'app-treasury-management',
  imports: [
    TreasuryHeaderComponent,
    TreasuryFiltersComponent,
    TreasurySummaryComponent,
    ExpenseTableComponent,
    ExpenseFormModalComponent,
    ExpenseDeleteModalComponent,
    PaginationComponent,
  ],
  templateUrl: './treasury-management.html',
})
export class TreasuryManagementPage implements OnInit {
  public readonly facade = inject(TreasuryFacade);
  ngOnInit(): void {
    this.facade.initialize();
  }
}
