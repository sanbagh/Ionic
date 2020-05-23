import { LoadingController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { Booking } from './booking';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';

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
    this.lc.create({ message: 'Loading bookings. Please wait..' }).then((x) => {
      x.present();
      let id;
      this.service.getUserId
        .pipe(
          switchMap((userId) => {
            id = userId;
            return this.service.token.pipe(
              switchMap((token) => {
                return this.client.get(
                  this.url +
                    'bookings.json?auth=' +
                    token +
                    '&orderBy="userId"&equalTo="' +
                    userId +
                    '"'
                );
              })
            );
          }),
          map((y: [{ key: string; place: any }]) => {
            const bookings: Booking[] = [];
            let booking = null;
            if (y !== null) {
              for (const key of Object.keys(y)) {
                const data: Booking = y[key];
                booking = new Booking(
                  key,
                  data.placeId,
                  id,
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
      null,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guests,
      bookedFrom,
      bookedTo
    );

    this.service.getUserId
      .pipe(
        switchMap((userId) => {
          if (!userId) {
            throw new Error('no user id found');
          }
          booking.userId = userId;
          return this.service.token.pipe(
            switchMap((token) => {
              return this.client.post(
                this.url + 'bookings.json?auth=' + token,
                {
                  ...booking,
                  id: null,
                }
              );
            })
          );
        })
      )
      .subscribe((x: any) => {
        booking.id = x.name;
        this.data.push(booking);
        this.subject.next([...this.data]);
      });
  }
  cancelBooking(id: string) {
    this.service.token
      .pipe(
        switchMap((token) => {
          return this.client.delete(
            this.url + 'bookings/' + id + '.json?auth=' + token
          );
        })
      )
      .subscribe((x) => {
        this.data = this.data.filter((y) => y.id !== id);
        this.subject.next([...this.data]);
      });
  }
}
