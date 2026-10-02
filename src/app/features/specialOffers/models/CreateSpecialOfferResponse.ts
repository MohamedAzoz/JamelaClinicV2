export interface CreateSpecialOfferResponse {
  id: number;
  title: string;
  description: string;
  offerPrice: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}
