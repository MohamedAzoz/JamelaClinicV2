import { Component, inject, OnInit } from '@angular/core';
import { AppointmentFacade } from '../../services/appointment.facade';
import { DoctorTodayHeaderComponent } from '../../components/doctor-today-header/doctor-today-header';
import { DoctorTodayTableComponent } from '../../components/doctor-today-table/doctor-today-table';

@Component({
  selector: 'app-doctor-today-appointments-page',
  providers: [AppointmentFacade],
  imports: [DoctorTodayHeaderComponent, DoctorTodayTableComponent],
  templateUrl: './doctor-today-appointments.html', 
})
export class DoctorTodayAppointmentsPage implements OnInit {
  readonly facade = inject(AppointmentFacade);

  ngOnInit(): void {
    this.facade.loadMyTodayAppointments();
  }
}
