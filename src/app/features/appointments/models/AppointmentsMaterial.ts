import { AppointmentStatus } from './AppointmentStatus';
import { MaterialItem } from './MaterialItem';

export interface AppointmentsMaterial {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: string;
  queueNumber: number;
  appointmentDate: string;
  status: string;
  consultationFee: number;
  discountAmount: number;
  finalPaidAmount: number;
  totalMaterialsCost: number;
  netAppointmentAmount: number;
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
  materials: MaterialItem[];
}

export interface TodayAppointment {
  id: number;
  patientName: string;
  visitType: number;
  queueNumber: number;
  status: number;
  appointmentDate: string;
}
