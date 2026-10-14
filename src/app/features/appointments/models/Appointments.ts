import { AppointmentStatus } from './AppointmentStatus';
import { PaymentMethod } from './PaymentMethod';
/*
 {
      "id": 81,
      "patientName": "نجلاء ناجح",
      "patientPhoneNumber": "01105709380",
      "patientAddress": "سوهاج",
      "clinicName": "جلسات الليزر",
      "queueNumber": 1,
      "appointmentDate": "2026-10-12",
      "createdAt": "2026-10-12T21:09:53.5137212",
      "doctorScheduleId": 20,
      "doctorName": "د رحاب محجوب",
      "employeeName": "دوريس",
      "status": 3,
      "paymentMethod": null, // ?
      "paymentMethodText": "غير محدد", // ??
      "consultationFee": 510,
      "discountAmount": 0,
      "doctorPercentage": 30,
      "centerPercentage": 70,
      "doctorEarnings": 153,
      "centerEarnings": 357,
      "totalMaterialsCost": 0,
      "materialsDescription": "بكيني واندرارم",
      "netAppointmentAmount": 510,
      "finalPaidAmount": 510,
      "cancelledByEmployeeName": ""
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
  paymentMethod: PaymentMethod;
  paymentMethodText: string;
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
