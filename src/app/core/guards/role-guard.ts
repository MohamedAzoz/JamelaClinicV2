import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from '@core/services/identity-service';
import { RoleCheck } from '@core/services/role-check';
import { RoutesManagement } from '@shared/constants/app-routes.constants';

export const roleGuard: CanActivateFn = (route, state) => {
  const roleCheck = inject(RoleCheck);
  const identity = inject(IdentityService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  // 1. التحقق من تسجيل الدخول (استخدام createUrlTree لأمان الملاحة)
  if (!identity.isAuthenticated()) {
    const loginUrl = `/${RoutesManagement.AUTH.path}/${RoutesManagement.LOGIN.path}`;
    return router.createUrlTree([loginUrl]);
  }

  // 2. إذا لم تتم إضافة أدوار مطلوبة للمسار، يسمح بالمرور
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 3. التحقق من الصلاحيات
  if (roleCheck.hasRole(requiredRoles)) {
    return true;
  }

  // 4. التوجيه لصفحة الرفض
  return router.createUrlTree(['/access-denied']);
};
