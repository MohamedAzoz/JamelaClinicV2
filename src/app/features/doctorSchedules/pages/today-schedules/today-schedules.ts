import { Component, inject, OnInit } from '@angular/core';
import { DoctorScheduleFacade } from '../../services/doctor-schedule.facade';
import { TodaySchedulesHeaderComponent } from '../../components/today-schedules-header/today-schedules-header';
import { TodaySchedulesCardsComponent } from '../../components/today-schedules-cards/today-schedules-cards';

@Component({
  selector: 'app-today-schedules',
  imports: [TodaySchedulesHeaderComponent, TodaySchedulesCardsComponent],
  templateUrl: './today-schedules.html',
  providers: [DoctorScheduleFacade],
})
export class TodaySchedulesPage implements OnInit {
  public facade = inject(DoctorScheduleFacade);

  ngOnInit(): void {
    this.facade.loadTodaySchedules();
  }
}
