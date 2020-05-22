import { PlcaeLocation } from './../../../places/offers/location';
import { Subscription } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController, LoadingController } from '@ionic/angular';
import {
  Component,
  OnInit,
  OnDestroy,
  ɵConsole,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  staticImageUrl = '';
  @Output() pickedLocation = new EventEmitter<PlcaeLocation>();
  sub: Subscription;
  constructor(
    private modalCtrl: ModalController,
    private client: HttpClient,
    private lc: LoadingController
  ) {}

  ngOnInit() {}
  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent }).then((x) => {
      x.onDidDismiss().then((y) => {
        if (!y.data) {
          return;
        }
        this.lc
          .create({ message: 'Loading location. Please await...' })
          .then((ele) => {
            ele.present();
            this.sub = this.client
              .get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${y.data.lng},${y.data.lat}.json?access_token=${environment.mapbox.accessToken}`
              )
              .subscribe((data: any) => {
                if (data.features[0] !== null) {
                  // console.log(data.features[0].place_name);
                  this.staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${y.data.lng}%2C${y.data.lat}%5D%7D)/${y.data.lng},${y.data.lat},12/500x300?access_token=${environment.mapbox.accessToken}`;
                  this.pickedLocation.emit({
                    lng: y.data.lng,
                    lat: y.data.lat,
                    address: data.features[0].place_name,
                    staticMapImageUrl: this.staticImageUrl,
                  });
                  ele.dismiss();
                }
              });
          });
      });
      x.present();
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
