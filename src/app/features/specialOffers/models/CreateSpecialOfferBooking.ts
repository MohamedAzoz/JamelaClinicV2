export interface CreateSpecialOfferBooking {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  specialOfferId: number;
}

export interface UpdateSpecialOfferBooking {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  specialOfferId: number;
}
