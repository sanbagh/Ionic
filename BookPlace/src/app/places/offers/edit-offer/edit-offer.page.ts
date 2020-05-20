import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { Place } from '../../place';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  formGroup: FormGroup;
  offer: Place;
  constructor(
    private acRoute: ActivatedRoute,
    private service: PlacesService
  ) {}

  ngOnInit() {
    this.acRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.offer = this.service.getPlace(x.get('id'));

      this.formGroup = new FormGroup({
        title: new FormControl(this.offer.title, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        description: new FormControl(this.offer.description, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)],
        }),
      });
    });
  }
  saveOffer() {
    if (this.formGroup.invalid) {
      return;
    }
  }
}
