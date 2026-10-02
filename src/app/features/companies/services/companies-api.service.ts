import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Result } from '@core/models/Result';
import { Company } from '../models/Company';
import { AddCompany } from '../models/AddCompany';

@Service()
export class CompaniesApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Companies`;

  //     GET
  // /api/Companies

  getAllCompanie() {
    return this._httpClient.get<Result<Company[]>>(this._baseUrl);
  }

  // POST
  // /api/Companies
  addCompany(data: AddCompany) {
    return this._httpClient.post<Result<Company>>(this._baseUrl, data);
  }

  // GET
  // /api/Companies/{id}
  getCompanyById(id: number) {
    return this._httpClient.get<Result<Company>>(`${this._baseUrl}/${id}`);
  }

  // PUT
  // /api/Companies/{id}
  updateCompany(id: number, data: AddCompany) {
    return this._httpClient.put<Result<boolean>>(`${this._baseUrl}/${id}`, data);
  }

  // DELETE
  // /api/Companies/{id}
  deleteCompany(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this._baseUrl}/${id}`);
  }
}
