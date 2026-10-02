import { VisitType } from './VisitType';

export interface AppointmentUpdate {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: VisitType;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
}
