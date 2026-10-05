import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorClinicsFacade } from '../../services/doctor-clinics.facade';
import { DoctorClinicsHeaderComponent } from '../../components/doctor-clinics-header/doctor-clinics-header';
import { DoctorClinicsTableComponent } from '../../components/doctor-clinics-table/doctor-clinics-table';
import { DoctorClinicAssignModalComponent } from '../../components/doctor-clinic-assign-modal/doctor-clinic-assign-modal';
import { DoctorClinicEditModalComponent } from '../../components/doctor-clinic-edit-modal/doctor-clinic-edit-modal';
import { DoctorClinicDeleteModalComponent } from '../../components/doctor-clinic-delete-modal/doctor-clinic-delete-modal';

@Component({
  selector: 'app-doctor-clinics',
  imports: [
    DoctorClinicsHeaderComponent,
    DoctorClinicsTableComponent,
    DoctorClinicAssignModalComponent,
    DoctorClinicEditModalComponent,
    DoctorClinicDeleteModalComponent,
  ],
  providers: [DoctorClinicsFacade],
  templateUrl: './doctor-clinics.html',
})
export class DoctorClinicsPage implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _facade = inject(DoctorClinicsFacade);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('doctorId');
    if (id) {
      this._facade.initPage(id);
    } else {
      this._router.navigate(['/main/doctors']);
    }
  }
}
