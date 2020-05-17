import { ExpenseService } from './expense.service';
import { IonInput, AlertController, Platform } from '@ionic/angular';

import {
  Component,
  ViewChild,
  ElementRef,
  ViewChildren,
  OnInit,
} from '@angular/core';
import { IExpense } from './expense';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  expenses: IExpense[] = [];
  total = 0;
  @ViewChildren(IonInput) inputs: IonInput[];
  constructor(
    private service: ExpenseService,
    private alertController: AlertController
  ) {}
  ngOnInit(): void {
    this.service.notifier.subscribe((x) => {
      this.expenses = x;
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Invalid Inputs',
      message: 'Please provide valid values',
      buttons: ['OK'],
    });

    await alert.present();
  }
  getTotal() {
    return this.service.getTotal();
  }
  clear() {
    this.inputs.forEach((element) => {
      element.value = '';
    });
  }
  addExpense(desc: string, amount: any) {
    if (!desc || desc.length <= 0 || !amount || amount.length <= 0) {
      this.presentAlert();
      return;
    }
    this.service.addExpense({ desc, amount });
  }
}
