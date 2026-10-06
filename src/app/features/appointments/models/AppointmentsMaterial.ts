import { MaterialItem } from './MaterialItem';
/**{
    "id": 0,
    "patientName": "string",
    "patientPhoneNumber": "string",
    "patientAddress": "string",
    "clinicName": "string",
    "visitType": "string",
    "queueNumber": 0,
    "appointmentDate": "string",
    "status": "string",
    "consultationFee": 0,
    "discountAmount": 0,
    "finalPaidAmount": 0,
    "totalMaterialsCost": 0,
    "netAppointmentAmount": 0,
    "doctorPercentage": 0,
    "centerPercentage": 0,
    "doctorEarnings": 0,
    "centerEarnings": 0,
    "materials": [
      {
        "appointmentMaterialId": 0,
        "materialId": 0,
        "materialName": "string",
        "description": "string",
        "quantity": 0,
        "unitPriceAtUsage": 0,
        "totalPrice": 0
      }
    ]
  } */
export interface AppointmentsMaterial {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  clinicName: string; //added
  visitType: string | null;
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
  clinicName: string; //added
  status: number;
  appointmentDate: string;
}
