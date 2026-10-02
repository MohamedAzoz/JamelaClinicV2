import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentFacade } from '../../services/appointment.facade';
import { ScheduleAppointmentsHeaderComponent } from '../../components/schedule-appointments-header/schedule-appointments-header';
import { ScheduleAppointmentsTableComponent } from '../../components/schedule-appointments-table/schedule-appointments-table';

@Component({
  selector: 'app-schedule-appointments',
  imports: [ScheduleAppointmentsHeaderComponent, ScheduleAppointmentsTableComponent],
  templateUrl: './schedule-appointments.html',
  providers: [AppointmentFacade],
})
export class ScheduleAppointmentsPage implements OnInit {
  readonly facade = inject(AppointmentFacade);
  private readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const scheduleId = Number(params['scheduleId']);
      if (scheduleId) {
        this.facade.loadAppointmentsByScheduleId(scheduleId);
      }
    });
  }
}
