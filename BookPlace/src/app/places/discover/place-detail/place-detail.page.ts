import { switchMap } from 'rxjs/operators';
import { MapModalComponent } from './../../../shared/map-modal/map-modal.component';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../../places.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular';
import { Place } from '../../place';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  bookable = false;
  subscription: Subscription;
  constructor(
    private mc: ModalController,
    private acRoute: ActivatedRoute,
    private service: PlacesService,
    private authService: AuthService,
    private bservice: BookingService,
    private actionSheetctrl: ActionSheetController,
    private lc: LoadingController
  ) {}

  ngOnInit() {
    this.acRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.lc.create({ message: 'Loading place. Please wait' }).then((ele) => {
        ele.present();
        this.authService.getUserId
          .pipe(
            switchMap((userId) => {
              if (!userId) {
                this.bookable = this.place.userId !== userId;
              }
              return this.service.getPlace(x.get('id'));
            })
          )
          .subscribe((y) => {
            this.place = y;
            this.place.toDate = new Date(this.place.toDate);
            this.place.fromDate = new Date(this.place.fromDate);
            ele.dismiss();
          });
      });
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
          this.lc
            .create({ message: 'placing booking, please wait..' })
            .then((x) => {
              x.present();
              const data = result.data;
              this.bservice.addBooking(
                this.place.id,
                this.place.title,
                this.place.imageUrl,
                data.firstName,
                data.lastName,
                data.guests,
                data.fromDate,
                data.toData
              );
              x.dismiss();
            });
        }
      });
  }
  openMapModel() {
    this.mc
      .create({
        component: MapModalComponent,
        componentProps: {
          lat: this.place.location?.lat,
          lng: this.place.location?.lng,
        },
      })
      .then((ele) => {
        ele.present();
      });
  }
}
