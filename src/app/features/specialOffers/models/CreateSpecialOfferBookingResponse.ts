export interface CreateSpecialOfferBookingResponse {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  specialOfferId: number;
  specialOfferTitle: string;
  paidAmount: number;
  isRedeemed: boolean;
  employeeId: string;
  employeeName: string;
  appointmentId: number;
  createdAt: Date;
}

export interface SpecialOfferBookingReport {
  offerId: number;
  title: string;
  offerPrice: number;
  isActive: boolean;
  totalBookingsCount: number;
  totalRevenue: number;
  bookings: SpecialOfferBookingReportItem[];
}
export interface SpecialOfferBookingReportItem {
  bookingId: number;
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  paidAmount: number;
  isRedeemed: boolean;
  createdByEmployeeName: string;
  createdAt: Date;
}
