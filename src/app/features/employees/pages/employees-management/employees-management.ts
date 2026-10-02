import { Component, inject, OnInit } from '@angular/core';
import { EmployeeFacade } from '../../services/employee.facade';
import { EmployeeHeaderComponent } from '../../components/employee-header/employee-header';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table';
import { EmployeeFormModalComponent } from '../../components/employee-form-modal/employee-form-modal';
import { EmployeeDeleteModalComponent } from '../../components/employee-delete-modal/employee-delete-modal';

@Component({
  selector: 'app-employees-management',
  imports: [
    EmployeeHeaderComponent,
    EmployeeTableComponent,
    EmployeeFormModalComponent,
    EmployeeDeleteModalComponent,
  ],
  templateUrl: './employees-management.html',
})
export class EmployeesManagementPage implements OnInit {
  private _facade = inject(EmployeeFacade);

  ngOnInit(): void {
    this._facade.loadEmployees();
  }
}
