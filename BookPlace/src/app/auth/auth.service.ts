import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId = 'user1';
  constructor() {}
  get getUserId() {
    return this.userId;
  }
}
