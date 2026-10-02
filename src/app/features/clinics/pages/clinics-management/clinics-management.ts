import { Component, inject, OnInit } from '@angular/core';
import { ClinicFacade } from '../../services/clinic.facade';
import { ClinicHeaderComponent } from '../../components/clinic-header/clinic-header';
import { ClinicTableComponent } from '../../components/clinic-table/clinic-table';
import { ClinicFormModalComponent } from '../../components/clinic-form-modal/clinic-form-modal';
import { ClinicDeleteModalComponent } from '../../components/clinic-delete-modal/clinic-delete-modal';

@Component({
  selector: 'app-clinics-management',
  imports: [
    ClinicHeaderComponent,
    ClinicTableComponent,
    ClinicFormModalComponent,
    ClinicDeleteModalComponent,
  ],
  templateUrl: './clinics-management.html',
})
export class ClinicsManagementPage implements OnInit {
  private _facade = inject(ClinicFacade);

  ngOnInit(): void {
    this._facade.loadClinics();
  }
}
