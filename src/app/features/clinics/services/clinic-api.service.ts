import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { CreateClinicResponse } from '../models/CreateClinicRequest';
import { Clinic } from '../models/Clinic';
import { CreateClinicRequest } from '../models/CreateClinicRequest.1';

@Service()
export class ClinicApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Clinics`;

  //     POST
  // /api/Clinics/create-clinic
  /*
Name
*/
  createClinic(request: CreateClinicRequest) {
    const url = `${this._baseUrl}/create-clinic`;
    return this._httpClient.post<Result<CreateClinicResponse>>(url, request);
  }

  // GET
  // /api/Clinics
  getClinics() {
    const url = `${this._baseUrl}`;
    return this._httpClient.get<Result<Clinic[]>>(url);
  }

  // GET
  // /api/Clinics/{id}
  getClinicById(id: number) {
    const url = `${this._baseUrl}/${id}`;
    return this._httpClient.get<Result<Clinic>>(url);
  }

  // PUT
  // /api/Clinics/update-clinic/{id}
  updateClinic(id: number, request: CreateClinicRequest) {
    const url = `${this._baseUrl}/update-clinic/${id}`;
    return this._httpClient.put<Result<Clinic>>(url, request);
  }

  // DELETE
  // /api/Clinics/delete-clinic/{id}
  deleteClinic(id: number) {
    const url = `${this._baseUrl}/delete-clinic/${id}`;
    return this._httpClient.delete<Result<boolean>>(url);
  }
}
