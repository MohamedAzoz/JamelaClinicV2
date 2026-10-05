import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { Doctor } from '../models/Doctor';
import { UpdateDoctorRequest } from '../models/UpdateDoctorRequest';
import { AssignDoctorClinics } from '../models/AssignDoctorClinics';
import { UpdateDoctorClinics } from '../models/UpdateDoctorClinics';
import { DoctorClinicsResponse } from '../models/DoctorClinicsResponse';

@Service()
export class DoctorApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Doctors`;

  //     GET
  // /api/Doctors/all
  //isActive

  getAllDoctors(isActive?: boolean, clinicId?: number) {
    let url = `${this._baseUrl}/all` + (isActive ? `?isActive=${isActive}` : '');
    if (clinicId) url = `${url}?clinicId=${clinicId}`;
    return this._httpClient.get<Result<Doctor[]>>(url);
  }

  // GET
  // /api/Doctors/{id}
  getDoctorById(id: string) {
    const url = `${this._baseUrl}/${id}`;
    return this._httpClient.get<Result<Doctor>>(url);
  }

  // PUT
  // /api/Doctors/update
  updateDoctor(request: UpdateDoctorRequest) {
    const url = `${this._baseUrl}/update`;
    return this._httpClient.put<Result<boolean>>(url, request);
  }

  // DELETE
  // /api/Doctors/delete-by-user/{userId}
  deleteDoctorByUserId(userId: string) {
    const url = `${this._baseUrl}/delete-by-user/${userId}`;
    return this._httpClient.delete<Result<boolean>>(url);
  }

  // PATCH
  // /api/Doctors/toggle-status/{userId}
  toggleStatus(userId: string) {
    const url = `${this._baseUrl}/toggle-status/${userId}`;
    return this._httpClient.patch<Result<boolean>>(url, null);
  }

  /************************************************ */
  //   DoctorClinics
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  private get _doctorClinicsUrl() {
    return `${environment.appBaseUrl}/DoctorClinics`;
  }

  // POST
  // /api/DoctorClinics/assign
  assign(data: AssignDoctorClinics) {
    return this._httpClient.post<Result<DoctorClinicsResponse>>(
      `${this._doctorClinicsUrl}/assign`,
      data,
    );
  }

  // PUT
  // /api/DoctorClinics/{id}
  updateAssign(id: number | string, data: UpdateDoctorClinics) {
    return this._httpClient.put<Result<DoctorClinicsResponse>>(
      `${this._doctorClinicsUrl}/${id}`,
      data,
    );
  }

  // GET
  // /api/DoctorClinics/doctor/{doctorId}
  getDoctorClinicsByDoctorId(doctorId: string) {
    return this._httpClient.get<Result<DoctorClinicsResponse[]>>(
      `${this._doctorClinicsUrl}/doctor/${doctorId}`,
    );
  }

  // GET
  // /api/DoctorClinics/clinic/{clinicId}
  getDoctorClinicsByClinicId(clinicId: number) {
    return this._httpClient.get<Result<DoctorClinicsResponse[]>>(
      `${this._doctorClinicsUrl}/clinic/${clinicId}`,
    );
  }

  // DELETE
  // /api/DoctorClinics/doctor/{doctorId}/clinic/{clinicId}
  deleteDoctorClinics(doctorId: string, clinicId: number) {
    return this._httpClient.delete<Result<boolean>>(
      `${this._doctorClinicsUrl}/doctor/${doctorId}/clinic/${clinicId}`,
    );
  }
}
