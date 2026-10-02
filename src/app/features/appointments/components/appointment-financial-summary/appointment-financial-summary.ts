import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';

@Component({
  selector: 'app-appointment-financial-summary',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './appointment-financial-summary.html',
})
export class AppointmentFinancialSummaryComponent {
  readonly facade = inject(AppointmentFacade);
  readonly appointment = input.required<AppointmentsMaterial>();

  readonly faWallet = faWallet;

  readonly totalMaterialsCost = computed(
    () => this.appointment()?.totalMaterialsCost ?? 0,
  );
}
