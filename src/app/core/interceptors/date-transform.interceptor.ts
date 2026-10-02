import { HttpInterceptorFn } from '@angular/common/http';


export const dateTransformInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
