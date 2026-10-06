import { VisitType } from './VisitType';

export interface CreateAppointments {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType?: VisitType | null;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
  isPaid: boolean;
}
