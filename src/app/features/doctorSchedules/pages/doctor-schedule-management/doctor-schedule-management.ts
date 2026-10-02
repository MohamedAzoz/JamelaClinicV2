import { Component, inject, OnInit } from '@angular/core';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';
import { ScheduleToolbarComponent } from '../../components/schedule-toolbar/schedule-toolbar';
import { ScheduleTableComponent } from '../../components/schedule-table/schedule-table';
import { ScheduleFormModalComponent } from '../../components/schedule-form-modal/schedule-form-modal';
import { ScheduleDeleteModalComponent } from '../../components/schedule-delete-modal/schedule-delete-modal';

@Component({
  selector: 'app-doctor-schedule-management',
  imports: [
    ScheduleToolbarComponent,
    ScheduleTableComponent,
    ScheduleFormModalComponent,
    ScheduleDeleteModalComponent,
  ],
  templateUrl: './doctor-schedule-management.html',
  providers: [DoctorScheduleFacade],
})
export class DoctorScheduleManagementPage implements OnInit {
  public facade = inject(DoctorScheduleFacade);

  ngOnInit(): void {
    void this.facade.init();
  }
}
