import { LoadingController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { Place } from './place';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
      this.client
        .get(this.url + 'offer-places.json')
        .pipe(
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
                data.userId
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
    return this.client.get(this.url + 'offer-places/' + id + '.json').pipe(
      map((y: any) => {
        return new Place(
          id,
          y.title,
          y.description,
          y.imageUrl,
          y.price,
          y.fromDate,
          y.toDate,
          y.userId
        );
      })
    );
  }
  addPlace(place: Place) {
    if (place === null) {
      return;
    }
    // place.id = Math.random().toString();
    place.imageUrl =
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200';
    place.userId = this.authService.getUserId;
    this.client
      .post(this.url + 'offer-places.json', { ...place, id: null })
      .subscribe((x: any) => {
        place.id = x.name;
        this.places.push(place);
        this.subject.next([...this.places]);
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
      this.client
        .put(this.url + 'offer-places/' + id + '.json', {
          ...this.places[index],
          id: null,
        })
        .subscribe((y) => {
          this.subject.next([...this.places]);
          x.dismiss();
        });
    });
  }
}
