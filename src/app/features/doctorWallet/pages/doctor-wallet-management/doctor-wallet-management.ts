import { Component, inject, OnInit } from '@angular/core';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { WalletHeaderComponent } from '../../components/wallet-header/wallet-header';
import { WalletSummaryComponent } from '../../components/wallet-summary/wallet-summary';
import { WalletFiltersComponent } from '../../components/wallet-filters/wallet-filters';
import { WalletTableComponent } from '../../components/wallet-table/wallet-table';
import { PaginationComponent } from '@shared/components/pagination';
import { WalletTransactionModalComponent } from '../../components/wallet-transaction-modal/wallet-transaction-modal';

@Component({
  selector: 'app-doctor-wallet-management',
  providers: [DoctorWalletFacade],
  imports: [
    WalletHeaderComponent,
    WalletSummaryComponent,
    WalletFiltersComponent,
    WalletTableComponent,
    PaginationComponent,
    WalletTransactionModalComponent,
  ],
  templateUrl: './doctor-wallet-management.html',
})
export class DoctorWalletManagementPage implements OnInit {
  readonly facade = inject(DoctorWalletFacade);

  ngOnInit(): void {
    this.facade.initialize();
  }
}
