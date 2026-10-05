import { AppointmentStatus } from './AppointmentStatus';
import { Period } from './Period';

export interface FilterAppointment {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  DoctorId?: string;
  EmployeeId?: string;
  ClinicId?: number;
  PageNumber?: number;
  PageSize?: number;
}


export interface FilterAppointments {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  ClinicId?: number;
  DoctorId?: string;
  EmployeeId?: string;
  Status: AppointmentStatus | null;
}
