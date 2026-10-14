import { AppointmentStatus } from './AppointmentStatus';
import { PaymentMethod } from './PaymentMethod';
import { Period } from './Period';

export interface FilterAppointments {
  Period: Period | null;
  FromDate?: string;
  ToDate?: string;
  ClinicId?: number;
  DoctorId?: string;
  EmployeeId?: string;
  Status: AppointmentStatus | null;
  PaymentMethod?: PaymentMethod | null;
}

