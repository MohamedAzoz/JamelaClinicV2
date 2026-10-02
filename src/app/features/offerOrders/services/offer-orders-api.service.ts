import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Result } from '@core/models/Result';
import { OfferOrder } from '../models/OfferOrder';
import { AddOfferOrder } from '../models/AddOfferOrder';
import { PayOfferOrder } from '../models/PayOfferOrder';
import { CompanyFinancialSummary } from '../models/CompanyFinancialSummary';

@Service()
export class OfferOrdersApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/OfferOrders`;
  //     GET
  // /api/OfferOrders
  getAllOfferOrders(companyId: number) {
    return this._httpClient.get<Result<OfferOrder[]>>(this._baseUrl, { params: { companyId } });
  }
  // POST
  // /api/OfferOrders
  addOfferOrder(data: AddOfferOrder) {
    return this._httpClient.post<Result<OfferOrder>>(this._baseUrl, data);
  }
  // GET
  // /api/OfferOrders/{id}
  getOfferOrderById(id: number) {
    return this._httpClient.get<Result<OfferOrder>>(`${this._baseUrl}/${id}`);
  }
  // DELETE
  // /api/OfferOrders/{id}
  deleteOfferOrder(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this._baseUrl}/${id}`);
  }
  // POST
  // /api/OfferOrders/{id}/pay-remaining
  payRemainingOfferOrder(id: number, data: PayOfferOrder) {
    return this._httpClient.post<Result<OfferOrder>>(`${this._baseUrl}/${id}/pay-remaining`, data);
  }
  // GET
  // /api/OfferOrders/company-financial-summary/{companyId}
  getCompanyFinancialSummary(companyId: number) {
    return this._httpClient.get<Result<CompanyFinancialSummary>>(
      `${this._baseUrl}/company-financial-summary/${companyId}`,
    );
  }
}
