import { LoadingController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { Place } from './place';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  url = environment.url;
  private places: Place[] = [];
  private subject = new BehaviorSubject<Place[]>(this.places);

  constructor(
    private client: HttpClient,
    private authService: AuthService,
    private lc: LoadingController
  ) {}
  getPlaces() {
    this.lc.create({ message: 'Loading places. Please wait..' }).then((x) => {
      x.present();
      this.authService.token
        .pipe(
          switchMap((token) => {
            return this.client.get(
              this.url + 'offer-places.json?auth=' + token
            );
          }),
          map((y: [{ key: string; place: any }]) => {
            const places: Place[] = [];
            for (const key of Object.keys(y)) {
              const data: Place = y[key];
              const place = new Place(
                key,
                data.title,
                data.description,
                data.imageUrl,
                data.price,
                data.fromDate,
                data.toDate,
                data.userId,
                data.location
              );
              places.push(place);
            }
            return places;
          })
        )
        .subscribe((z) => {
          this.places = z;
          this.subject.next([...this.places]);
          x.dismiss();
        });
    });
    return this.subject.asObservable();
  }
  getPlace(id: string) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.client.get(
          this.url + 'offer-places/' + id + '.json?auth=' + token
        );
      }),
      map((y: any) => {
        return new Place(
          id,
          y.title,
          y.description,
          y.imageUrl,
          y.price,
          y.fromDate,
          y.toDate,
          y.userId,
          y.location
        );
      })
    );
  }
  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.client.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-bookplace-4ca58.cloudfunctions.net/storeImage',
          formData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }
  addPlace(place: Place) {
    if (place === null) {
      return;
    }
    // place.id = Math.random().toString();
    // place.imageUrl =
    //   'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200';
    this.authService.getUserId.subscribe((userId) => {
      place.userId = userId;
      this.authService.token
        .pipe(
          switchMap((token) => {
            return this.client.post(
              this.url + 'offer-places.json?auth=' + token,
              {
                ...place,
                id: null,
              }
            );
          })
        )
        .subscribe((x: any) => {
          place.id = x.name;
          this.places.push(place);
          this.subject.next([...this.places]);
        });
    });
  }
  updatePlace(id: string, title: string, desc: string) {
    const index = this.places.findIndex((x) => x.id === id);
    if (index < 0) {
      return;
    }
    this.places[index].title = title;
    this.places[index].description = desc;
    this.lc.create({ message: 'Updating place. Please wait...' }).then((x) => {
      x.present();

      this.authService.token
        .pipe(
          switchMap((token) => {
            return this.client.put(
              this.url + 'offer-places/' + id + '.json?auth=' + token,
              {
                ...this.places[index],
                id: null,
              }
            );
          })
        )
        .subscribe((y) => {
          this.subject.next([...this.places]);
          x.dismiss();
        });
    });
  }
}
