import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Result } from '@core/models/Result';
import { DoctorSchedule } from '../models/DoctorSchedule';
import { DoctorScheduleItem } from '../models/DoctorScheduleItem';
import { DoctorScheduleUpdate } from '../models/DoctorScheduleUpdate';
import { DoctorScheduleCreate } from '../models/DoctorScheduleCreate';

@Service()
export class DoctorScheduleApiService {
  private _http = inject(HttpClient);
  private baseUrl = `${environment.appBaseUrl}/DoctorSchedules`;
  //     GET
  // /api/DoctorSchedules/doctor/{doctorId}
  getDoctorScheduleByDoctorId(doctorId: string, isActive?: boolean, onlyFuture?: boolean) {
    let url = `${this.baseUrl}/doctor/${doctorId}`;
    const params: string[] = [];
    if (isActive !== undefined) {
      params.push(`isActive=${isActive}`);
    }
    if (onlyFuture !== undefined) {
      params.push(`onlyFuture=${onlyFuture}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<DoctorSchedule[]>>(url);
  }

  // GET
  // /api/DoctorSchedules/{scheduleId}
  getDoctorScheduleByScheduleId(scheduleId: string) {
    return this._http.get<Result<DoctorSchedule>>(`${this.baseUrl}/${scheduleId}`);
  }

  //   GET
  // /api/DoctorSchedules/doctor/{doctorId}/month/{month}
  getDoctorScheduleByDoctorIdAndMonth(doctorId: string, month: number) {
    return this._http.get<Result<DoctorSchedule[]>>(
      `${this.baseUrl}/doctor/${doctorId}/month/${month}`,
    );
  }
  // DELETE
  // /api/DoctorSchedules/{scheduleId}
  deleteDoctorSchedule(scheduleId: number) {
    return this._http.delete<Result<boolean>>(`${this.baseUrl}/${scheduleId}`);
  }
  // POST
  // /api/DoctorSchedules/create
  createDoctorSchedule(schedule: DoctorScheduleCreate) {
    return this._http.post<Result<boolean>>(`${this.baseUrl}/create`, schedule);
  }

  // PUT
  // /api/DoctorSchedules/update
  updateDoctorSchedule(schedule: DoctorScheduleUpdate) {
    return this._http.put<Result<boolean>>(`${this.baseUrl}/update`, schedule);
  }

  // PATCH
  // /api/DoctorSchedules/toggle-status/{scheduleId}
  toggleStatus(scheduleId: number) {
    return this._http.patch<Result<boolean>>(`${this.baseUrl}/toggle-status/${scheduleId}`, null);
  }

  //GET
  // /api/DoctorSchedules/today
  getTodaySchedules() {
    return this._http.get<Result<DoctorScheduleItem[]>>(`${this.baseUrl}/today`);
  }
}
