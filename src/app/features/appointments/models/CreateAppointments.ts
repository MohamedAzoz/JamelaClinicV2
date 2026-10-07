export interface CreateAppointments {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  doctorClinicId: number;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
  isPaid: boolean;
  totalMaterialsCost?: number;
  materialsDescription?: string;
}
