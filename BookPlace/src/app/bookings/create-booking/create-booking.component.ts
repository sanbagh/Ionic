import { Place } from './../../places/place';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  constructor(private mc: ModalController) {}

  ngOnInit() {}
  cancel() {
    this.mc.dismiss(null, 'cancel');
  }
  bookPlace() {
    this.mc.dismiss({ message: 'Booked' }, 'confirm');
  }
}
