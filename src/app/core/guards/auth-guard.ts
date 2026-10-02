import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from '../services/identity-service';
import { RoutesManagement } from '@shared/constants/app-routes.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const identityService = inject(IdentityService);

  return identityService.isAuthenticated()
    ? true
    : router.createUrlTree([`/${RoutesManagement.AUTH.path}/${RoutesManagement.LOGIN.path}`]);
};
