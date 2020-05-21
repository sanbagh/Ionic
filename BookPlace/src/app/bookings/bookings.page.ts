import { Subscription } from 'rxjs';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './booking';
import { IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  subscription: Subscription;
  constructor(private service: BookingService, private lc: LoadingController) {}

  ngOnInit() {
    this.subscription = this.service.bookings.subscribe(
      (x) => (this.bookings = x)
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  cancelBooking(id: string, slideItem: IonItemSliding) {
    slideItem.close();
    this.lc.create({ message: 'Cancelling booking...' }).then((x) => {
      this.service.cancelBooking(id);
      x.dismiss();
    });
  }
}
