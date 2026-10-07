import { AppointmentStatus } from './AppointmentStatus';
import { Period } from './Period';

export interface FilterAppointments {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  ClinicId?: number;
  DoctorId?: string;
  EmployeeId?: string;
  Status: AppointmentStatus | null;
}
