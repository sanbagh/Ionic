import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private service: AuthService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.service.userAuthenticate.pipe(
      take(1),
      switchMap((isAuth) => {
        if (!isAuth) {
          return this.service.autoLogin();
        } else {
          return of(isAuth);
        }
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
