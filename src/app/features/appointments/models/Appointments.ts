import { AppointmentStatus } from './AppointmentStatus';
/*
  {
        "id": 0,
        "patientName": "string",
        "patientPhoneNumber": "string",
        "patientAddress": "string",
        "clinicName": "string",
        "queueNumber": 0,
        "appointmentDate": "2026-10-07",
        "createdAt": "2026-10-07T03:33:40.921Z",
        "doctorScheduleId": 0,
        "doctorName": "string",
        "employeeName": "string",
        "status": 0,
        "consultationFee": 0,
        "discountAmount": 0,
        "doctorPercentage": 0,
        "centerPercentage": 0,
        "doctorEarnings": 0,
        "centerEarnings": 0,
        "totalMaterialsCost": 0,
        "materialsDescription": "string",
        "netAppointmentAmount": 0,
        "finalPaidAmount": 0,
        "cancelledByEmployeeName": "string"
      } */
export interface Appointments {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  clinicName: string; //
  queueNumber: number;
  appointmentDate: Date;
  createdAt: Date;
  doctorScheduleId: number;
  doctorName: string;
  employeeName: string;
  status: AppointmentStatus;
  consultationFee: number;
  discountAmount: number; ////
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
  totalMaterialsCost: number;
  materialsDescription: string;
  netAppointmentAmount: number;
  finalPaidAmount: number; ////
  cancelledByEmployeeName: string | null | undefined;
}
