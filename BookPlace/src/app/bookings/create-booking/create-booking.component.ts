import { Place } from './../../places/place';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;
  constructor(private mc: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.fromDate);
    const availableTo = new Date(this.selectedPlace.toDate);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }
  cancel() {
    this.mc.dismiss(null, 'cancel');
  }
  bookPlace() {
    if (this.form.invalid || !this.dateValid()) {
      return;
    }
    this.mc.dismiss(
      {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        guests: +this.form.value.guests,
        fromDate: new Date(this.form.value.fromDate),
        toDate: new Date(this.form.value.toDate),
      },
      'confirm'
    );
  }
  dateValid() {
    if (!this.form || this.form === null) {
      return;
    }
    const fromDate = this.form.value.fromDate;
    const toDate = this.form.value.toDate;
    return toDate > fromDate;
  }
}
