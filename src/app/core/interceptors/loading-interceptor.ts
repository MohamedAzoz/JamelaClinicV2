import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '@core/services/loading-service';
// import { LoadingService } from '@core/services/loading-service';
import { finalize } from 'rxjs';
export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const isTranslationRequest = req.url.includes('i18n') || req.url.includes('.json');

  if (isTranslationRequest) {
    // مرر الطلب مباشرة دون إظهار شاشة التحميل وتغيير الـ Signals
    return next(req);
  }
  if (req.context.get(SkipLoading)) {
    return next(req);
  }
  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));

};
