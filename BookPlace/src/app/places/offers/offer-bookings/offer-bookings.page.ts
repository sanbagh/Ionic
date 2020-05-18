import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../place';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;
  constructor(
    private acRoute: ActivatedRoute,
    private service: PlacesService
  ) {}

  ngOnInit() {
    this.acRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.place = this.service.getPlace(x.get('id'));
    });
  }
}
