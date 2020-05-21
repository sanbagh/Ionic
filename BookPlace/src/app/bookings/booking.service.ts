import { AuthService } from './../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private subject = new BehaviorSubject<Booking[]>([]);
  private data: Booking[] = [];
  constructor(private service: AuthService) {}
  get bookings() {
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
      Math.random().toString(),
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
    this.data.push(booking);
    this.subject.next([...this.data]);
  }
  cancelBooking(id: string) {
    this.data = this.data.filter((x) => x.id !== id);
    this.subject.next([...this.data]);
  }
}
