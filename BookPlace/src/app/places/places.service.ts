import { AuthService } from './../auth/auth.service';
import { Place } from './place';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      149.99,
      new Date('2020-05-20'),
      new Date('2025-05-20'),
      'user'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      189.99,
      new Date('2020-05-20'),
      new Date('2025-05-20'),
      'user'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      99.99,
      new Date('2020-05-20'),
      new Date('2025-05-20'),
      'user'
    ),
  ];
  private subject = new BehaviorSubject<Place[]>(this.places);

  constructor(private authService: AuthService) {}
  getPlaces() {
    return this.subject.asObservable();
  }
  getPlace(id: string): Place {
    return { ...this.places.find((x) => x.id === id) };
  }
  addPlace(place: Place) {
    if (place === null) {
      return;
    }
    place.id = Math.random().toString();
    place.imageUrl =
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200';
    place.userId = this.authService.getUserId;
    this.places.push(place);
    this.subject.next([...this.places]);
  }
  updatePlace(id: string, title: string, desc: string) {
    const index = this.places.findIndex((x) => x.id === id);
    if (index < 0) {
      return;
    }
    this.places[index].title = title;
    this.places[index].description = desc;
    this.subject.next([...this.places]);
  }
}
