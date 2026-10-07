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
  DoctorScheduleId?: number;
}
