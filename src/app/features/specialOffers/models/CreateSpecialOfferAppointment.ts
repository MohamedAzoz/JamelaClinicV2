import { VisitType } from "./VisitType";

export interface CreateSpecialOfferAppointment {
  bookingId: number;
  doctorId: string;
  doctorScheduleId: number;
  visitType: VisitType;
}
