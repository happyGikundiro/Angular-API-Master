import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../../model/model';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<Post>, next: HttpHandler): Observable<HttpEvent<Post>> {
    const tokenReq = req.clone({
      setHeaders: { Authorization: `Bearer mock-token` }
    });

    return next.handle(tokenReq).pipe(
      tap(
        event => console.log('HTTP Request:', event),
        error => console.log('HTTP Error:', error)
      )
    );
  }
}
