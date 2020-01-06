import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    // const expiration = this.authService.getExpiration();
    // const now = new Date();
    // const expiresIn = expiration.getTime() - now.getTime();

    // debugger;
    // if (expiresIn <= 0) {
    //   debugger;
    //   this.authService.logout();
    // }

    if (token) {
      const request = req.clone({
        // headers: req.headers.set('Authorization', 'Bearer ' + token),
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
      return next.handle(request);
    }

    return next.handle(req);
  }
}
