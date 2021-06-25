import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    let nextReq: HttpRequest<any> = req.clone();
    if (!!localStorage.getItem(environment.sessionStorageKey)) {
      const token = localStorage.getItem(environment.sessionStorageKey);
      nextReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }
    return next.handle(nextReq);
  }
}
