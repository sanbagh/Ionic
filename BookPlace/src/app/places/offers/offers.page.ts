import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offerPlaces: Place[] = [];

  constructor(private service: PlacesService) {}

  ngOnInit() {
    this.offerPlaces = this.service.getPlaces();
  }
}
