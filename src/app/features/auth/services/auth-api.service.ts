import { Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject } from '@angular/core';
import { RegisterEmployeeRequest } from '../models/RegisterEmployee';
import { RegisterEmployeeResponse } from '../models/RegisterEmployeeResponse';
import { Result } from '../../../core/models/Result';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { UserInfo } from '../models/UserInfo';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { ChangePasswordResponse } from '../models/ChangePasswordResponse';
import { AdminChangePasswordRequest } from '../models/AdminChangePasswordRequest';
import { RegisterDoctorRequest } from '../models/RegisterDoctorRequest';
import { RegisterDoctorResponse } from '../models/RegisterDoctorResponse';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { UserProfile } from '../models/UserProfile';

@Service()
export class AuthApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Auth`;

  registerEmployee(request: RegisterEmployeeRequest) {
    const url = `${this._baseUrl}/register-employee`;
    return this._httpClient.post<Result<RegisterEmployeeResponse>>(url, request);
  }

  //   POST
  // /api/Auth/register-doctor
  RegisterDoctor(request: RegisterDoctorRequest) {
    const url = `${this._baseUrl}/register-doctor`;
    return this._httpClient.post<Result<RegisterDoctorResponse>>(url, request);
  }

  //   /api/Auth/login
  login(request: LoginRequest) {
    const url = `${this._baseUrl}/login`;
    return this._httpClient.post<Result<LoginResponse>>(url, request);
  }

  getCurrentUser() {
    const url = `${this._baseUrl}/GetCurrentUser`;
    return this._httpClient.get<Result<UserProfile>>(url);
  }

  changePassword(request: ChangePasswordRequest) {
    const url = `${this._baseUrl}/change-password`;
    return this._httpClient.post<ChangePasswordResponse>(url, request);
  }

  adminChangePassword(request: AdminChangePasswordRequest) {
    const url = `${this._baseUrl}/admin-change-password`;
    return this._httpClient.post<Result<boolean>>(url, request);
  }

  //  رGET
  // /api/Auth/UserLoginLog
  userLoginLog(PageNumber: number, PageSize: number) {
    const url = `${this._baseUrl}/UserLoginLog?PageNumber=${PageNumber}&PageSize=${PageSize}`;
    return this._httpClient.get<Result<PaginatedResult<UserInfo[]>>>(url);
  }
}
