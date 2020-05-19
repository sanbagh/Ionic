import { BookingService } from './booking.service';
import { Component, OnInit } from '@angular/core';
import { Booking } from './booking';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: Booking[];

  constructor(private service: BookingService) {}

  ngOnInit() {
    this.bookings = this.service.bookings;
  }
  cancelBooking(id: string, slideItem: IonItemSliding) {
    slideItem.close();
  }
}
