import { Plugins } from '@capacitor/core';
import { User } from './user';
import { BehaviorSubject, from } from 'rxjs';
import { AuthResponseData } from './auth';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  timeout: any;

  constructor(private client: HttpClient) {}
  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  signUp(email: string, password: string) {
    return this.client
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((data) => {
          const exp = new Date(new Date().getTime() + +data.expiresIn * 1000);
          const user = new User(data.localId, data.email, data.idToken, exp);
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
          this.storeAuthData(
            data.localId,
            data.email,
            data.idToken,
            exp.toISOString()
          );
        })
      );
  }
  login(email: string, password: string) {
    return this.client
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((data) => {
          const exp = new Date(new Date().getTime() + +data.expiresIn * 1000);
          const user = new User(data.localId, data.email, data.idToken, exp);
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
          this.storeAuthData(
            data.localId,
            data.email,
            data.idToken,
            exp.toISOString()
          );
        })
      );
  }
  get getUserId() {
    return this._user.asObservable().pipe(
      map((x) => {
        if (x === null) {
          return null;
        }
        return x.id;
      })
    );
  }
  get userAuthenticate() {
    return this._user.asObservable().pipe(
      map((x) => {
        if (x === null) {
          return false;
        }
        return !!x.userToken;
      })
    );
  }
  get token() {
    return this._user.asObservable().pipe(
      map((x) => {
        if (x === null) {
          return null;
        }
        return x.userToken;
      })
    );
  }
  private storeAuthData(
    userId: string,
    email: string,
    token: string,
    exp: string
  ) {
    const data = JSON.stringify({ userId, email, token, exp });
    Plugins.Storage.set({ key: 'authData', value: data });
  }
  autoLogin() {
    return from(
      Plugins.Storage.get({ key: 'authData' }).then((authData) => {
        if (!authData || !authData.value) {
          return false;
        }
        const { userId, email, token, exp } = JSON.parse(authData.value);
        const expDate = new Date(exp);
        if (expDate <= new Date()) {
          return false;
        }
        if (!token) {
          return false;
        }
        const user = new User(userId, email, token, expDate);
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
        return true;
      })
    );
  }
  private autoLogout(exp: number) {
    this.timeout = setTimeout(() => {
      this.logout();
    }, exp);
  }
  logout() {
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }
}
