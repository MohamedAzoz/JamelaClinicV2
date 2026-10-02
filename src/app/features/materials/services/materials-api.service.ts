import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { CreateMaterial, Material } from '../models/Material';
import { SkipLoading } from '@core/interceptors/loading-interceptor';

@Service()
export class MaterialsApiService {
  private readonly _httpClient = inject(HttpClient);
  baseUrl = `${environment.appBaseUrl}/Materials`;
  //   GET
  // /api/Materials/get-all-materials
  /*
PageNumber
PageSize
isActive */
  getAllMaterials(pageNumber?: number, pageSize?: number, isActive?: boolean) {
    let url = `${this.baseUrl}/get-all-materials`;
    const params: string[] = [];
    if (pageNumber !== undefined) {
      params.push(`PageNumber=${pageNumber}`);
    }
    if (pageSize !== undefined) {
      params.push(`PageSize=${pageSize}`);
    }
    if (isActive !== undefined) {
      params.push(`isActive=${isActive}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._httpClient.get<Result<PaginatedResult<Material[]>>>(url, {
      context: new HttpContext().set(SkipLoading, true),
    });
  }
  // GET
  // /api/Materials/get-material-by-id/{id}
  getMaterialById(id: number) {
    return this._httpClient.get<Result<Material>>(`${this.baseUrl}/get-material-by-id/${id}`);
  }
  // POST
  // /api/Materials/create-material
  createMaterial(material: CreateMaterial) {
    return this._httpClient.post<Result<Material>>(`${this.baseUrl}/create-material`, material);
  }
  // PUT
  // /api/Materials/update-material
  updateMaterial(material: Material) {
    return this._httpClient.put<Result<boolean>>(`${this.baseUrl}/update-material`, material);
  }
  // DELETE
  // /api/Materials/delete-material/{id}
  deleteMaterial(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this.baseUrl}/delete-material/${id}`);
  }
  // PATCH
  // /api/Materials/toggle-status/{id}
  toggleMaterialStatus(id: number) {
    return this._httpClient.patch<Result<boolean>>(`${this.baseUrl}/toggle-status/${id}`, null);
  }
}
