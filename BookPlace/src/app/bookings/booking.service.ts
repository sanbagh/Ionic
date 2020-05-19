import { Booking } from './booking';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private data: Booking[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      userId: '1',
      placeTitle: 'Manhattan Mansion',
      guests: 2,
    },
  ];
  get bookings() {
    return this.data;
  }
}
