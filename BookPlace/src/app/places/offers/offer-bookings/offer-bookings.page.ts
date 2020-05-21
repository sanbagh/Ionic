import { LoadingController } from '@ionic/angular';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../place';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  subscription: any;
  constructor(
    private acRoute: ActivatedRoute,
    private service: PlacesService,
    private lc: LoadingController
  ) {}

  ngOnInit() {
    this.acRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.lc.create({ message: 'Loading place. Please wait' }).then((ele) => {
        ele.present();
        this.subscription = this.service
          .getPlace(x.get('id'))
          .subscribe((y) => {
            this.place = y;
            ele.dismiss();
          });
      });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
