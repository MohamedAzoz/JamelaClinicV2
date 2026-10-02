export interface SpecialOfferAppointment {
  id: number;
  patientName: string;
  patientPhoneNumber?: string;
  appointmentDate?: string;
  doctorName?: string;
  status?: number | string;
  discountAmount?: number;
  finalPaidAmount?: number;
}
