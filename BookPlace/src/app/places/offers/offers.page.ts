import { Subscription } from 'rxjs';
import { PlacesService } from './../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offerPlaces: Place[] = [];
  subscription: Subscription;
  constructor(private service: PlacesService, private router: Router) {}

  ngOnInit() {
    this.service.getPlaces().subscribe((x) => {
      this.offerPlaces = x;
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  edit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/places/tabs/offers/edit/' + id]);
  }
}
