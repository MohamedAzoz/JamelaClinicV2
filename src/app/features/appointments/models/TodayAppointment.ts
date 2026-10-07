import { AppointmentStatus } from './AppointmentStatus';

export interface TodayAppointment {
  id: number;
  patientName: string;
  queueNumber: number;
  clinicName: string;
  status: AppointmentStatus;
  appointmentDate: string;
}
