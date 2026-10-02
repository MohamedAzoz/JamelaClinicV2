import { VisitType } from './VisitType';

export interface CreateAppointments {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: VisitType;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
  isPaid: boolean;
}
