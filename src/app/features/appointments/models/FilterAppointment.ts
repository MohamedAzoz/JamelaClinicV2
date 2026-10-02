import { AppointmentStatus } from './AppointmentStatus';
import { Period } from './Period';

export interface FilterAppointment {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  DoctorId?: string;
  EmployeeId?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface FilterAppointmentsForExcel {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
}

export interface FilterAppointments {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  DoctorId?: string;
  EmployeeId?: string;
  Status: AppointmentStatus | null;
}
