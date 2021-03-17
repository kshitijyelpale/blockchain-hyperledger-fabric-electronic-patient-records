import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private accessTokenRefreshed: Subject<any> = new Subject();
  private authService: AuthService;

  constructor(private injector: Injector) {
    this.authService = this.injector.get(AuthService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status !== 401 && err.status !== 403) {
          return throwError(err.message);
        }

        return this.refreshAccessToken()
          .pipe(
            switchMap(() => {
              req = this.addAuthHeader(req);

              return next.handle(req);
            }),
            catchError((e: any) => {
              console.error(e);
              this.authService.logoutUser();

              return of({});
            })
          );
      })
    );
  }

  private refreshAccessToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log('Access Token Refreshed!');
          this.refreshTokenInProgress = false;
          this.accessTokenRefreshed.next();
        })
      );
    }
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any>{
    if (request.url.includes('token')) {
      return request.clone({
        setHeaders: {
          Role: `${this.authService.getRole()}`
        }
      });
    }

    if (request.url.includes('logout')) {
      return request.clone({
        setHeaders: {
          token: `${this.authService.getRefreshToken()}`
        }
      });
    }

    const token = this.authService.getToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Role: `${this.authService.getRole()}`,
          username: `${this.authService.getUsername()}`
        }
      });
    }

    return request;
  }
}
