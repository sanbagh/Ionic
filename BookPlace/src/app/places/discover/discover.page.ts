import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Place } from '../place';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  places: Place[];
  placesExFetured: Place[];
  constructor(private service: PlacesService) {}

  ngOnInit() {
    this.places = this.service.getPlaces();
    this.placesExFetured = this.places.slice(1);
  }
  filterUpdate(event: CustomEvent<SegmentChangeEventDetail>){}
}
