import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { Employee } from '../models/Employee';
import { UpdateEmployee } from '../models/UpdateEmployee';

@Service()
export class EmployeeApiService {
  private readonly _httpClient = inject(HttpClient);
  baseUrl = `${environment.appBaseUrl}/Employees`;

  //     GET
  // /api/Employees/all
  getAllEmployees(isActive?: boolean) {
    if (isActive !== undefined) {
      return this._httpClient.get<Result<Employee[]>>(`${this.baseUrl}/all?isActive=${isActive}`);
    }
    return this._httpClient.get<Result<Employee[]>>(`${this.baseUrl}/all`);
  }
  // GET
  // /api/Employees/{userId}
  getEmployeeByUserId(userId: string) {
    return this._httpClient.get<Result<Employee>>(`${this.baseUrl}/${userId}`);
  }
  // PUT
  // /api/Employees/update
  updateEmployee(employee: UpdateEmployee) {
    return this._httpClient.put<Result<boolean>>(`${this.baseUrl}/update`, employee);
  }
  // DELETE
  // /api/Employees/delete-by-user/{userId}
  deleteEmployeeByUserId(userId: string) {
    return this._httpClient.delete<Result<boolean>>(`${this.baseUrl}/delete-by-user/${userId}`);
  }
}
