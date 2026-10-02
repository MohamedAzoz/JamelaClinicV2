import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from 'environments/environment';
import { CreateSpecialOffer } from '../models/CreateSpecialOffer';
import { CreateSpecialOfferResponse } from '../models/CreateSpecialOfferResponse';
import { Result } from '@core/models/Result';
import {
  CreateSpecialOfferBooking,
  UpdateSpecialOfferBooking,
} from '../models/CreateSpecialOfferBooking';
import {
  CreateSpecialOfferBookingResponse,
  SpecialOfferBookingReport,
} from '../models/CreateSpecialOfferBookingResponse';
import { CreateSpecialOfferAppointment } from '../models/CreateSpecialOfferAppointment';

@Service()
export class SpecialOffersApiService {
  private readonly _httpClient = inject(HttpClient);
  baseUrl = `${environment.appBaseUrl}/SpecialOffers`;
  //   POST
  // /api/SpecialOffers
  createSpecialOffer(specialOffer: CreateSpecialOffer) {
    return this._httpClient.post<Result<CreateSpecialOfferResponse>>(
      `${this.baseUrl}`,
      specialOffer,
    );
  }

  // GET
  // /api/SpecialOffers
  getAllSpecialOffers(onlyActive?: boolean) {
    const url =
      onlyActive === undefined ? this.baseUrl : `${this.baseUrl}?onlyActive=${onlyActive}`;
    return this._httpClient.get<Result<CreateSpecialOfferResponse[]>>(url);
  }

  // GET
  // /api/SpecialOffers/{id}
  getSpecialOfferById(id: number) {
    return this._httpClient.get<Result<CreateSpecialOfferResponse>>(`${this.baseUrl}/${id}`);
  }

  // DELETE
  // /api/SpecialOffers/{id}
  deleteSpecialOffer(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this.baseUrl}/${id}`);
  }

  // PATCH
  // /api/SpecialOffers/{id}/toggle-status
  toggleSpecialOfferStatus(id: number) {
    return this._httpClient.patch<Result<boolean>>(`${this.baseUrl}/${id}/toggle-status`, null);
  }

  // PUT
  // /api/SpecialOffers
  updateSpecialOffer(specialOffer: CreateSpecialOfferResponse) {
    return this._httpClient.put<Result<CreateSpecialOfferResponse>>(
      `${this.baseUrl}`,
      specialOffer,
    );
  }

  //   GET
  // /api/SpecialOffers/reports/{offerId}
  getSpecialOfferReport(offerId: number) {
    return this._httpClient.get<Result<SpecialOfferBookingReport>>(
      `${this.baseUrl}/reports/${offerId}`,
    );
  }

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
  //SpecialOfferBookings
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
  private readonly _bookingBaseUrl = `${environment.appBaseUrl}/SpecialOfferBookings`;
  // POST
  // /api/SpecialOfferBookings
  createSpecialOfferBooking(booking: CreateSpecialOfferBooking) {
    return this._httpClient.post<Result<CreateSpecialOfferBookingResponse>>(
      `${this._bookingBaseUrl}`,
      booking,
    );
  }

  // PUT
  // /api/SpecialOfferBookings
  updateSpecialOfferBooking(booking: UpdateSpecialOfferBooking) {
    return this._httpClient.put<Result<CreateSpecialOfferBookingResponse>>(
      `${this._bookingBaseUrl}`,
      booking,
    );
  }

  // DELETE
  // /api/SpecialOfferBookings/{id}
  deleteSpecialOfferBooking(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this._bookingBaseUrl}/${id}`);
  }
  // POST
  // /api/SpecialOfferBookings/create-appointment-from-offer
  createAppointmentFromSpecialOfferBooking(booking: CreateSpecialOfferAppointment) {
    return this._httpClient.post<Result<boolean>>(
      `${this._bookingBaseUrl}/create-appointment-from-offer`,
      booking,
    );
  }
}
