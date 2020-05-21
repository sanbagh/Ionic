import { AuthService } from './../../auth/auth.service';
import { PlacesService } from './../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Place } from '../place';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  placesExFetured: Place[];
  relavantPlaces: Place[];
  subscription: Subscription;
  constructor(
    private service: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscription = this.service.getPlaces().subscribe((x) => {
      this.places = x;
      this.relavantPlaces = this.places;
      this.placesExFetured = this.relavantPlaces.slice(1);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  filterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relavantPlaces = this.places;
      this.placesExFetured = this.relavantPlaces.slice(1);
    } else {
      this.relavantPlaces = this.places.filter((x) => x.userId === this.authService.getUserId);
      this.placesExFetured = this.relavantPlaces.slice(1);
    }
  }
}
