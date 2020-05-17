import { IExpense } from './expense';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenses: IExpense[] = [];
  notifier = new Subject<IExpense[]>();
  constructor() {}
  addExpense(expense: IExpense) {
    this.expenses.push(expense);
    this.notifier.next(this.expenses);
  }
  getTotal() {
    let total = 0;
    this.expenses.forEach((element) => {
      total += +element.amount;
    });
    return total;
  }
}
