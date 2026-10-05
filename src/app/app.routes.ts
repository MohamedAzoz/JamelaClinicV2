import { Routes } from '@angular/router';
import { RoutesManagement } from './shared/constants/app-routes.constants';
import { authGuard } from '@core/guards/auth-guard';
import { roleGuard } from '@core/guards/role-guard';
import { ROLES } from '@shared/constants/roles.constants';

export const routes: Routes = [
  { path: '', redirectTo: RoutesManagement.AUTH.path, pathMatch: 'full' },

  {
    path: RoutesManagement.AUTH.path,

    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  // main route
  {
    path: RoutesManagement.MAIN.path,
    canActivate: [authGuard],
    loadComponent: () => import('@shared/components/main/main').then((m) => m.Main),
    children: [
      {
        path: '',
        redirectTo: RoutesManagement.DASHBOARD.path,
        pathMatch: 'full',
      },
      {
        path: RoutesManagement.DASHBOARD.path,
        loadComponent: () =>
          import('@shared/components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: RoutesManagement.CLINICS.path,
        loadComponent: () =>
          import('./features/clinics/pages/clinics-management/clinics-management').then(
            (m) => m.ClinicsManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTORS.path,
        loadComponent: () =>
          import('./features/doctors/pages/doctors-management/doctors-management').then(
            (m) => m.DoctorsManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_CLINICS.path,
        loadComponent: () =>
          import('./features/doctors/pages/doctor-clinics/doctor-clinics').then(
            (m) => m.DoctorClinicsPage,
          ),
      },
      {
        path: RoutesManagement.EMPLOYEES.path,
        loadComponent: () =>
          import('./features/employees/pages/employees-management/employees-management').then(
            (m) => m.EmployeesManagementPage,
          ),
      },
      {
        path: RoutesManagement.TREASURY.path,
        loadComponent: () =>
          import('./features/treasury/pages/treasury-management/treasury-management').then(
            (m) => m.TreasuryManagementPage,
          ),
      },
      {
        path: RoutesManagement.SPECIAL_OFFERS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant, ROLES.Reception] },
        loadComponent: () =>
          import('./features/specialOffers/pages/special-offers-management/special-offers-management').then(
            (m) => m.SpecialOffersManagementPage,
          ),
      },
      {
        path: RoutesManagement.SPECIAL_OFFER_DETAILS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant, ROLES.Reception] },
        loadComponent: () =>
          import('./features/specialOffers/pages/special-offer-details/special-offer-details').then(
            (m) => m.SpecialOfferDetailsPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_WALLET.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant, ROLES.Doctor] },
        loadComponent: () =>
          import('./features/doctorWallet/pages/doctor-wallet-management/doctor-wallet-management').then(
            (m) => m.DoctorWalletManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_WALLET_TRANSACTION_DETAILS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant, ROLES.Doctor] },
        loadComponent: () =>
          import('./features/doctorWallet/pages/wallet-transaction-details/wallet-transaction-details').then(
            (m) => m.WalletTransactionDetailsPage,
          ),
      },
      {
        path: RoutesManagement.MATERIALS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin] },
        loadComponent: () =>
          import('./features/materials/pages/materials-management/materials-management').then(
            (m) => m.MaterialsManagementPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_SCHEDULES.path,
        loadComponent: () =>
          import('./features/doctorSchedules/pages/doctor-schedule-management/doctor-schedule-management').then(
            (m) => m.DoctorScheduleManagementPage,
          ),
      },
      {
        path: RoutesManagement.TODAY_DOCTOR_SCHEDULES.path,
        loadComponent: () =>
          import('./features/doctorSchedules/pages/today-schedules/today-schedules').then(
            (m) => m.TodaySchedulesPage,
          ),
      },
      {
        path: RoutesManagement.USER_LOGIN_LOGS.path,
        loadComponent: () =>
          import('./features/auth/pages/user-login-log/user-login-log').then(
            (m) => m.UserLoginLogPage,
          ),
      },
      {
        path: RoutesManagement.CHANGE_PASSWORD.path,
        loadComponent: () =>
          import('./features/auth/pages/change-password/change-password').then(
            (m) => m.ChangePasswordPage,
          ),
      },
      {
        path: RoutesManagement.ADMIN_PASSWORD_MANAGEMENT.path,
        canActivate: [roleGuard],
        data: {
          roles: [ROLES.Admin],
        },
        loadComponent: () =>
          import('./features/auth/pages/admin-password-management/admin-password-management').then(
            (m) => m.AdminPasswordManagementPage,
          ),
      },
      {
        path: RoutesManagement.PROFILE.path,
        loadComponent: () =>
          import('./features/auth/pages/profile/profile').then((m) => m.UserProfilePage),
      },

      {
        path: RoutesManagement.APPOINTMENTS.path,
        canActivate: [roleGuard],
        data: {
          roles: [ROLES.Admin, ROLES.Accountant],
        },
        loadComponent: () =>
          import('./features/appointments/pages/appointments-management/appointments-management').then(
            (m) => m.AppointmentsManagementPage,
          ),
      },
      {
        path: RoutesManagement.APPOINTMENT_BOOKING.path,
        loadComponent: () =>
          import('./features/appointments/pages/appointment-booking/appointment-booking').then(
            (m) => m.AppointmentBookingPage,
          ),
      },
      {
        path: RoutesManagement.SCHEDULE_APPOINTMENTS.path,
        loadComponent: () =>
          import('./features/appointments/pages/schedule-appointments/schedule-appointments').then(
            (m) => m.ScheduleAppointmentsPage,
          ),
      },
      {
        path: RoutesManagement.APPOINTMENT_DETAILS.path,
        loadComponent: () =>
          import('./features/appointments/pages/appointment-details/appointment-details').then(
            (m) => m.AppointmentDetailsPage,
          ),
      },
      {
        path: RoutesManagement.DOCTOR_TODAY_APPOINTMENTS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Doctor] },
        loadComponent: () =>
          import('./features/appointments/pages/doctor-today-appointments/doctor-today-appointments').then(
            (m) => m.DoctorTodayAppointmentsPage,
          ),
      },
      {
        path: RoutesManagement.COMPANIES.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant] },
        loadComponent: () =>
          import('./features/companies/pages/companies-management/companies-management').then(
            (m) => m.CompaniesManagementComponent,
          ),
      },
      {
        path: RoutesManagement.COMPANY_ORDERS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant] },
        loadComponent: () =>
          import('./features/offerOrders/pages/company-orders/company-orders').then(
            (m) => m.CompanyOrdersPage,
          ),
      },
      {
        path: RoutesManagement.OFFER_ORDER_DETAILS.path,
        canActivate: [roleGuard],
        data: { roles: [ROLES.Admin, ROLES.Accountant] },
        loadComponent: () =>
          import('./features/offerOrders/pages/offer-order-details/offer-order-details').then(
            (m) => m.OfferOrderDetailsPage,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('@shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
