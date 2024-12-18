import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const localtoken = localStorage.getItem('token')

    if (localtoken) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localtoken}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
