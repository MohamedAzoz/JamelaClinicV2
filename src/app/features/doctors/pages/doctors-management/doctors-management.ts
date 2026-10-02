import { Component, inject, OnInit } from '@angular/core';
import { DoctorFacade } from '../../services/doctor.facade';
import { DoctorHeaderComponent } from '../../components/doctor-header/doctor-header';
import { DoctorTableComponent } from '../../components/doctor-table/doctor-table';
import { DoctorFormModalComponent } from '../../components/doctor-form-modal/doctor-form-modal';
import { DoctorDeleteModalComponent } from '../../components/doctor-delete-modal/doctor-delete-modal';

@Component({
  selector: 'app-doctors-management',
  imports: [
    DoctorHeaderComponent,
    DoctorTableComponent,
    DoctorFormModalComponent,
    DoctorDeleteModalComponent,
  ],
  templateUrl: './doctors-management.html',
})
export class DoctorsManagementPage implements OnInit {
  private _facade = inject(DoctorFacade);

  ngOnInit(): void {
    this._facade.loadDoctors();
    this._facade.loadClinics();
  }
}
