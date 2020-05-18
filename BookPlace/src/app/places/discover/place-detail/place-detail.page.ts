import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../../places.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from '../../place';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(
    private mc: ModalController,
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
  bookPlace() {
    this.mc
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then((mele) => {
        mele.present();
        return mele.onDidDismiss();
      })
      .then((result) => {
        if (result.role === 'confirm') {
        }
      });
  }
}
