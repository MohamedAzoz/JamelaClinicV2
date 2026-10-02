import { Routes } from '@angular/router';
import { RoutesManagement } from '@shared/constants/app-routes.constants';
import { guestGuard } from '@core/guards/guest-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: RoutesManagement.LOGIN.path,
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: RoutesManagement.LOGIN.path,
    pathMatch: 'full',
  },
];
