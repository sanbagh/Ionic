import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer;
  date = Date.now();
  constructor() { }

  ngOnInit() {}
  getDate() {
    return this.date;
  }
}
