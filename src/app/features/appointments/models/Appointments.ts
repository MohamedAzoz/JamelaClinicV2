import { AppointmentStatus } from './AppointmentStatus';
import { VisitType } from './VisitType';

/*
  {
        "id": 0,
        "patientName": "string",
        "patientPhoneNumber": "string",
        "patientAddress": "string",
        "visitType": 0,
        "queueNumber": 0,
        "appointmentDate": "2026-09-26",
        "createdAt": "2026-09-26T11:40:25.700Z",
        "doctorScheduleId": 0,
        "doctorName": "string",
        "employeeName": "string",
        "status": 0,
        "consultationFee": 0,
        "discountAmount": 0, ///
        "doctorPercentage": 0,
        "centerPercentage": 0,
        "doctorEarnings": 0,
        "centerEarnings": 0,
        "finalPaidAmount": 0,///
        "cancelledByEmployeeName": "string"
      } */
export interface Appointments {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  visitType: VisitType;
  queueNumber: number;
  appointmentDate: Date;
  createdAt: Date;
  doctorScheduleId: number;
  doctorName: string;
  employeeName: string;
  status: AppointmentStatus;
  consultationFee: number;
  discountAmount: number;////
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
  finalPaidAmount: number;////
  cancelledByEmployeeName: string | null | undefined;
}
