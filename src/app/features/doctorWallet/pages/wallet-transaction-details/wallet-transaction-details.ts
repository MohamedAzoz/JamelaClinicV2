import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DoctorWalletFacade } from '../../services/doctor-wallet.facade';
import { WalletTransactionDetailsHeaderComponent } from '../../components/wallet-transaction-details-header/wallet-transaction-details-header';
import { WalletTransactionDetailsCardComponent } from '@features/doctorWallet/components/wallet-transaction-details-card/wallet-transaction-details-card';

@Component({
  selector: 'app-wallet-transaction-details',
  providers: [DoctorWalletFacade],
  imports: [
    FontAwesomeModule,
    WalletTransactionDetailsHeaderComponent,
    WalletTransactionDetailsCardComponent,
  ],
  templateUrl: './wallet-transaction-details.html',
})
export class WalletTransactionDetailsPage implements OnInit {
  readonly facade = inject(DoctorWalletFacade);
  readonly faSpinner = faSpinner;
  readonly faExclamationCircle = faExclamationCircle;
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      void this.facade.loadTransactionDetails(id);
    });
  }
}
