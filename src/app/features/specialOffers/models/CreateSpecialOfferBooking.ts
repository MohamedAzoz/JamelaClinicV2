import { PaymentMethod } from '../../appointments/models/PaymentMethod';

export interface CreateSpecialOfferBooking {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  specialOfferId: number;
  paymentMethod: PaymentMethod;
}

export interface UpdateSpecialOfferBooking {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  specialOfferId: number;
  paymentMethod: PaymentMethod;
}
