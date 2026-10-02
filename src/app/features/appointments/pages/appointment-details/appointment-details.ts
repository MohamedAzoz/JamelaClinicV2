import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentDetailsHeaderComponent } from '../../components/appointment-details-header/appointment-details-header';
import { AppointmentPatientInfoComponent } from '../../components/appointment-patient-info/appointment-patient-info';
import { AppointmentMaterialsSectionComponent } from '../../components/appointment-materials-section/appointment-materials-section';
import { AppointmentFinancialSummaryComponent } from '../../components/appointment-financial-summary/appointment-financial-summary';

@Component({
  selector: 'app-appointment-details-page',
  providers: [AppointmentFacade],
  imports: [
    FontAwesomeModule,
    AppointmentDetailsHeaderComponent,
    AppointmentPatientInfoComponent,
    AppointmentMaterialsSectionComponent,
    AppointmentFinancialSummaryComponent,
  ],
  templateUrl: './appointment-details.html',
})
export class AppointmentDetailsPage implements OnInit {
  readonly facade = inject(AppointmentFacade);
  private readonly _route = inject(ActivatedRoute);

  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;

  readonly appointmentId = signal<number | null>(null);

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.appointmentId.set(id);
      this.facade.loadAppointmentDetails(id);
      this.facade.loadActiveMaterials();
    }
  }
}
