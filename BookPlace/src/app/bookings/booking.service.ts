import { LoadingController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
  url = environment.url;
  private subject = new BehaviorSubject<Booking[]>([]);
  private data: Booking[] = [];
  constructor(
    private client: HttpClient,
    private service: AuthService,
    private lc: LoadingController
  ) {}
  get bookings() {
    this.lc.create({ message: 'Loading places. Please wait..' }).then((x) => {
      x.present();
      this.client
        .get(
          this.url +
            'bookings.json?orderBy="userId"&equalTo="' +
            this.service.getUserId +
            '"'
        )
        .pipe(
          map((y: [{ key: string; place: any }]) => {
            const bookings: Booking[] = [];
            if (y !== null) {
              for (const key of Object.keys(y)) {
                const data: Booking = y[key];
                const booking = new Booking(
                  key,
                  data.placeId,
                  this.service.getUserId,
                  data.placeTitle,
                  data.placeImage,
                  data.firstName,
                  data.lastName,
                  data.guests,
                  data.bookedFrom,
                  data.bookedTo
                );
                bookings.push(booking);
              }
            }
            return bookings;
          })
        )
        .subscribe((z) => {
          this.data = z;
          this.subject.next([...this.data]);
          x.dismiss();
        });
    });
    return this.subject.asObservable();
  }
  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guests: number,
    bookedFrom: Date,
    bookedTo: Date
  ) {
    const booking = new Booking(
      null,
      placeId,
      this.service.getUserId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guests,
      bookedFrom,
      bookedTo
    );
    this.client
      .post(this.url + 'bookings.json', { ...booking, id: null })
      .subscribe((x: any) => {
        booking.id = x.name;
        this.data.push(booking);
        this.subject.next([...this.data]);
      });
  }
  cancelBooking(id: string) {
    this.client.delete(this.url + 'bookings/' + id + '.json').subscribe((x) => {
      this.data = this.data.filter((y) => y.id !== id);
      this.subject.next([...this.data]);
    });
  }
}
