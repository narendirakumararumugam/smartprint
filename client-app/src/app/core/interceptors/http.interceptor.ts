import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const newUrl =  `${environment.baseApiUrl}` + req.url;
  const reqClone = req.clone({ 
    url: newUrl,
    withCredentials: true });
  return next(reqClone);
};
