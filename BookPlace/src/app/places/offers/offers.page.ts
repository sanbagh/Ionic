import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../place';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offerPlaces: Place[] = [];

  constructor(private service: PlacesService, private router: Router) {}

  ngOnInit() {
    this.offerPlaces = this.service.getPlaces();
  }
  edit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit/' + id]);
  }
}
