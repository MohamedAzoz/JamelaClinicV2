import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from 'environments/environment';
import { CreateAppointments } from '../models/CreateAppointments';
import { Appointments } from '../models/Appointments';
import { Result } from '@core/models/Result';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { FilterAppointment } from '../models/FilterAppointment';
import { FilterAppointments } from '../models/FilterAppointments';
import { AppointmentUpdate } from '../models/AppointmentUpdate';
import { AppointmentsStatistics } from '../models/AppointmentsStatistics';
import { AppointmentsMaterial } from '../models/AppointmentsMaterial';
import { TodayAppointment } from '../models/TodayAppointment';
import { UpdateAppointmentMaterial } from '../models/UpdateAppointmentMaterial';

@Service()
export class AppointmentApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.appBaseUrl}/Appointments`;

  //     POST
  // /api/Appointments/create-appointment
  createAppointments(data: CreateAppointments) {
    return this._http.post<Result<boolean>>(`${this._baseUrl}/create-appointment`, data);
  }

  // GET
  // /api/Appointments/get-all-appointments
  getAllAppointments(filter: FilterAppointment) {
    let url = `${this._baseUrl}/get-all-appointments`;
    const params: string[] = [];
    if (filter.Period !== null && filter.Period !== undefined) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined && filter.FromDate !== '') {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined && filter.ToDate !== '') {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined && filter.DoctorId !== '') {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined && filter.EmployeeId !== '') {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.ClinicId !== undefined && filter.ClinicId !== null) {
      params.push(`ClinicId=${filter.ClinicId}`);
    }
    if (filter.DoctorScheduleId !== undefined && filter.DoctorScheduleId !== null) {
      params.push(`DoctorScheduleId=${filter.DoctorScheduleId}`);
    }
    if (filter.PageNumber !== undefined) {
      params.push(`PageNumber=${filter.PageNumber}`);
    }
    if (filter.PageSize !== undefined) {
      params.push(`PageSize=${filter.PageSize}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<PaginatedResult<Appointments[]>>>(url);
  }

  // GET
  // /api/Appointments/export-excel
  getExportAppointments(filter: FilterAppointment) {
    let url = `${this._baseUrl}/export-excel`;
    const params: string[] = [];
    if (filter.Period !== null && filter.Period !== undefined) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined && filter.FromDate !== '') {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined && filter.ToDate !== '') {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined && filter.DoctorId !== '') {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined && filter.EmployeeId !== '') {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.ClinicId !== undefined && filter.ClinicId !== null) {
      params.push(`ClinicId=${filter.ClinicId}`);
    }
    if (filter.DoctorScheduleId !== undefined && filter.DoctorScheduleId !== null) {
      params.push(`DoctorScheduleId=${filter.DoctorScheduleId}`);
    }
    if (filter.PageNumber !== undefined) {
      params.push(`PageNumber=${filter.PageNumber}`);
    }
    if (filter.PageSize !== undefined) {
      params.push(`PageSize=${filter.PageSize}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get(url, { responseType: 'blob' });
  }

  //   PATCH
  // /api/Appointments/{id}/cancel
  cancelAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/cancel`, null);
  }

  //  DELETE
  // /api/Appointments/hard-delete/{appointmentId}
  hardDeleteAppointment(appointmentId: number) {
    return this._http.delete<Result<boolean>>(`${this._baseUrl}/hard-delete/${appointmentId}`);
  }

  // PATCH
  // /api/Appointments/{id}/pay
  payAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/pay`, null);
  }

  // PATCH
  // /api/Appointments/{id}/complete
  completeAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/complete`, null);
  }

  // GET
  // /api/Appointments/schedule/{scheduleId}
  getAppointmentsByScheduleId(scheduleId: number) {
    return this._http.get<Result<Appointments[]>>(`${this._baseUrl}/schedule/${scheduleId}`);
  }

  // PUT
  // /api/Appointments/update
  updateAppointment(appointment: AppointmentUpdate) {
    return this._http.put<Result<boolean>>(`${this._baseUrl}/update`, appointment);
  }

  // GET
  // /api/Appointments/statistics
  getStatistics(filter: FilterAppointments) {
    let url = `${this._baseUrl}/statistics`;
    const params: string[] = [];
    if (filter.Period !== null && filter.Period !== undefined) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined && filter.FromDate !== '') {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined && filter.ToDate !== '') {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined && filter.DoctorId !== '') {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined && filter.EmployeeId !== '') {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.ClinicId !== undefined && filter.ClinicId !== null) {
      params.push(`ClinicId=${filter.ClinicId}`);
    }
    if (filter.Status !== null && filter.Status !== undefined) {
      params.push(`Status=${filter.Status}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<AppointmentsStatistics>>(url);
  }

  //   GET
  // /api/Appointments/details-with-materials/{appointmentId}
  getAppointmentDetailsWithMaterials(appointmentId: number) {
    return this._http.get<Result<AppointmentsMaterial>>(
      `${this._baseUrl}/details-with-materials/${appointmentId}`,
    );
  }

  // GET
  // /api/Appointments/my-today-appointments-summary
  getMyTodayAppointmentsSummary() {
    return this._http.get<Result<TodayAppointment[]>>(
      `${this._baseUrl}/my-today-appointments-summary`,
    );
  }

  //  /api/Appointments/update-materials
  updateMaterials(data: UpdateAppointmentMaterial) {
    return this._http.put<Result<boolean>>(`${this._baseUrl}/update-materials`, data);
  }
  //   DELETE
  // /api/Appointments/clear-materials/{appointmentId}
  clearMaterials(appointmentId: number) {
    return this._http.delete<Result<boolean>>(`${this._baseUrl}/clear-materials/${appointmentId}`);
  }
}
