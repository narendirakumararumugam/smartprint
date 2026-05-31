import { HttpInterceptorFn } from '@angular/common/http';
import { AuthStateService } from '../services/auth-state.service';
import { inject } from '@angular/core';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('/api/') && !req.withCredentials) {
    const reqClone = req.clone({
      withCredentials: true
    });
    return next(reqClone);
  }

  return next(req);
};
