import { PaymentMethod } from './PaymentMethod';

/*{
    "id": 0,
    "patientName": "string",
    "patientPhoneNumber": "string",
    "patientAddress": "string",
    "clinicName": "string",
    "paymentMethod": 0,
    "queueNumber": 0,
    "appointmentDate": "string",
    "status": "string",
    "consultationFee": 0,
    "discountAmount": 0,
    "finalPaidAmount": 0,
    "totalMaterialsCost": 0,
    "materialsDescription": "string",
    "netAppointmentAmount": 0,
    "doctorPercentage": 0,
    "centerPercentage": 0,
    "doctorEarnings": 0,
    "centerEarnings": 0
  } */
export interface AppointmentsMaterial {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  clinicName: string;
  paymentMethod: PaymentMethod;
  queueNumber: number;
  appointmentDate: string;
  status: string;
  consultationFee: number;
  discountAmount: number;
  finalPaidAmount: number;
  totalMaterialsCost: number;
  materialsDescription: string;
  netAppointmentAmount: number;
  doctorPercentage: number;
  centerPercentage: number;
  doctorEarnings: number;
  centerEarnings: number;
}
