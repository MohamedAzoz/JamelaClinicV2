import { PaymentMethod } from './PaymentMethod';

export interface AppointmentUpdate {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  doctorScheduleId: number;
  doctorClinicId: number;
  consultationFee: number;
  paymentMethod: PaymentMethod;
  discountAmount?: number;
}

// {
//   "id": 0,
//   "patientName": "string",
//   "patientPhoneNumber": "string",
//   "patientAddress": "string",
//   "doctorScheduleId": 0,
//   "doctorClinicId": 0,
//   "consultationFee": 0,
//   "discountAmount": 0,
//   "paymentMethod": 0
// }
