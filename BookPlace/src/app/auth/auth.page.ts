import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private lc: LoadingController
  ) {}

  ngOnInit() {}
  onAuthChange() {
    this.isLogin = !this.isLogin;
  }
  authenticate(email: string, pass: string) {
    this.lc.create({ message: 'Logging in...' }).then((x) => {
      x.present();
      if (this.isLogin) {
        this.authService.login(email, pass).subscribe(
          (y) => {
            if (y != null) {
              this.router.navigate(['places/tabs/discover']);
            }
            x.dismiss();
          },
          (err) => {
            this.showAlert(err.error.error.message);
          }
        );
      } else {
        this.authService.signUp(email, pass).subscribe(
          (y) => {
            if (y != null) {
              this.router.navigate(['places/tabs/discover']);
            }
            x.dismiss();
          },
          (err) => {
            this.showAlert(err.error.error.message);
          }
        );
      }
    });
  }
  showAlert(message: any) {
    this.alertCtrl
      .create({ header: 'Error', message, buttons: ['Ok'] })
      .then((x) => {
        x.present();
        this.lc.dismiss();
      });
  }
  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.authenticate(f.value.email, f.value.password);
    f.reset();
  }
}
