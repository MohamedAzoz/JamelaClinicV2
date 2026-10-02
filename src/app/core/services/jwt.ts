import { Service } from '@angular/core';
import { IResJWT } from '@shared/models/UserInfo';
import { jwtDecode } from 'jwt-decode';

@Service()
export class JWT {
     public decodeToken(token: string) {
    if (!token) {
      return {} as IResJWT;
    }
    try {
      return jwtDecode<IResJWT>(token);
    } catch (error) {
      return {} as IResJWT;
    }
  }
}
