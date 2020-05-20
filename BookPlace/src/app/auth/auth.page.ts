import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  constructor() {}

  ngOnInit() {}
  onAuthChange() {
    this.isLogin = !this.isLogin;
  }
  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }
    const email = f.value.email;
    const pass = f.value.password;
  }
}
