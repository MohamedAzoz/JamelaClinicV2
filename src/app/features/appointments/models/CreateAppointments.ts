
/*{
  "patientName": "string",
  "patientPhoneNumber": "string",
  "patientAddress": "string",
  "doctorClinicId": 0,
  "doctorScheduleId": 0,
  "consultationFee": 0,
  "discountAmount": 0,
  "isPaid": true,
  "paymentMethod": 0,
  "totalMaterialsCost": 0,
  "materialsDescription": "string"
} */

import { PaymentMethod } from "./PaymentMethod";

export interface CreateAppointments {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  doctorClinicId: number;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  totalMaterialsCost?: number;
  materialsDescription?: string;
}
