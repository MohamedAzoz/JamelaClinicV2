import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { IdentityService } from '../services/identity-service';
import { throwError, retry, timer } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const identityService = inject(IdentityService);

  const token = identityService.token();
  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedReq).pipe(
    // إعدادات إعادة المحاولة الذكية
    retry({
      count: 2, // يحاول مرتين إضافيتين بعد الفشل الأول
      delay: (error: HttpErrorResponse, retryCount) => {
        // نكرر المحاولة فقط في حالة أخطاء السيرفر المؤقتة أو انقطاع الشبكة
        const transientErrors = [0, 408, 500, 502, 503, 504];
        if (transientErrors.includes(error.status)) {
          // Exponential Backoff: ينتظر ثانية ثم ثانيتين
          return timer(retryCount * 1000);
        }
        // لو الخطأ مش مؤقت (زي 401)، ارمي الخطأ فوراً ومتحاولش تاني
        return throwError(() => error);
      },
    }),
  );
};
