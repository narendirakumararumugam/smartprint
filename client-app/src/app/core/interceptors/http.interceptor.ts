import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { AuthStateService } from '../services/auth-state.service';
import { inject } from '@angular/core';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const token = authState.getToken();

  if (token && req.url.includes('/api/')) {
    const reqClone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(reqClone);
  }

  return next(req);
};
