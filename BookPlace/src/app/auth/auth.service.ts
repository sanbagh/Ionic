import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId = 'user';
  constructor() {}
  get getUserId() {
    return this.userId;
  }
}
