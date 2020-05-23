import { PlcaeLocation } from './../../../places/offers/location';
import { Subscription } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import {
  ModalController,
  LoadingController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import {
  Component,
  OnInit,
  OnDestroy,
  ɵConsole,
  EventEmitter,
  Output,
} from '@angular/core';
import { Capacitor, Geolocation } from '@capacitor/core';

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
    private asCtrl: ActionSheetController,
    private lc: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
  onPickLocation() {
    this.asCtrl
      .create({
        header: 'Please select',
        buttons: [
          {
            text: 'Auto-Locate',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on map',
            handler: () => {
              this.openMap();
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((ele) => {
        ele.present();
      });
  }
  async locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showAlert();
      return;
    }
    try {
      const location = await Geolocation.getCurrentPosition();
      if (location !== null) {
        this.getAndSetLocation(
          location.coords.longitude,
          location.coords.latitude
        );
      }
    } catch (err) {
      this.showAlert();
    }
  }

  private showAlert() {
    this.alertController
      .create({
        header: 'Error',
        message: 'Failed to locate',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.alertController.dismiss();
            },
          },
        ],
      })
      .then((x) => {
        x.present();
      });
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((x) => {
      x.onDidDismiss().then((y) => {
        if (!y.data) {
          return;
        }
        this.getAndSetLocation(y.data.lng, y.data.lat);
      });
      x.present();
    });
  }

  private getAndSetLocation(lng: number, lat: number) {
    this.lc
      .create({ message: 'Loading location. Please await...' })
      .then((ele) => {
        ele.present();
        this.sub = this.client
          .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${environment.mapbox.accessToken}`
          )
          .subscribe((data: any) => {
            if (data.features[0] !== null) {
              // console.log(data.features[0].place_name);
              this.staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${lng}%2C${lat}%5D%7D)/${lng},${lat},12/500x300?access_token=${environment.mapbox.accessToken}`;
              this.pickedLocation.emit({
                lng,
                lat,
                address: data.features[0].place_name,
                staticMapImageUrl: this.staticImageUrl,
              });
              ele.dismiss();
            }
          });
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
