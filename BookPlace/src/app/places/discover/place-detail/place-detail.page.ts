import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../../places.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
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
    private service: PlacesService,
    private actionSheetctrl: ActionSheetController
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
    this.actionSheetctrl
      .create({
        header: 'Choose an action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => this.openBookingModal('select'),
          },
          {
            text: 'Random Date',
            handler: () => this.openBookingModal('random'),
          },
        ],
      })
      .then((ele) => ele.present());
  }
  openBookingModal(val: 'select' | 'random') {
    this.mc
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: val },
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
