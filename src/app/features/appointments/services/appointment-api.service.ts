import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from 'environments/environment';
import { CreateAppointments } from '../models/CreateAppointments';
import { Appointments } from '../models/Appointments';
import { Result } from '@core/models/Result';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { FilterAppointment, FilterAppointments } from '../models/FilterAppointment';
import { AppointmentUpdate } from '../models/AppointmentUpdate';
import { AppointmentsStatistics } from '../models/AppointmentsStatistics';
import { AppointmentsMaterial, TodayAppointment } from '../models/AppointmentsMaterial';
import { AddMaterialToAppointment } from '../models/AddMaterialToAppointment';

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
    if (filter.Period !== null) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined) {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined) {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined) {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined) {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.ClinicId !== undefined) {
      params.push(`ClinicId=${filter.ClinicId}`);
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
    if (filter.Period !== null) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined) {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined) {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined) {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined) {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.ClinicId !== undefined) {
      params.push(`ClinicId=${filter.ClinicId}`);
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
    if (filter.Period !== null) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined) {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined) {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.DoctorId !== undefined) {
      params.push(`DoctorId=${filter.DoctorId}`);
    }
    if (filter.EmployeeId !== undefined) {
      params.push(`EmployeeId=${filter.EmployeeId}`);
    }
    if (filter.Status !== null) {
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

  //************************************ */
  // AppointmentMaterials

  //   POST
  // /api/AppointmentMaterials/add-material
  addMaterialToAppointment(data: AddMaterialToAppointment) {
    return this._http.post<Result<boolean>>(
      `${environment.appBaseUrl}/AppointmentMaterials/add-material`,
      data,
    );
  }

  // DELETE
  // /api/AppointmentMaterials/remove-material/{appointmentMaterialId}
  removeMaterialFromAppointment(appointmentMaterialId: number) {
    return this._http.delete<Result<boolean>>(
      `${environment.appBaseUrl}/AppointmentMaterials/remove-material/${appointmentMaterialId}`,
    );
  }
}
