import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { Doctor } from '../models/Doctor';
import { UpdateDoctorRequest } from '../models/UpdateDoctorRequest';

@Service()
export class DoctorApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Doctors`;

  //     GET
  // /api/Doctors/all
  //isActive

  getAllDoctors(isActive?: boolean) {
    const url = `${this._baseUrl}/all` + (isActive ? `?isActive=${isActive}` : '');
    return this._httpClient.get<Result<Doctor[]>>(url);
  }

  // GET
  // /api/Doctors/{id}
  getDoctorById(id: number) {
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
}
