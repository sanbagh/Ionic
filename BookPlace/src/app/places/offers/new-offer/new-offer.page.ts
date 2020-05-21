import { PlacesService } from './../../places.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../place';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  formGroup: FormGroup;
  constructor(
    private service: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      availableFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      availableTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }
  createOffer() {
    this.loadingCtrl
      .create({ message: 'creating place.Please wait..' })
      .then((x) => {
        x.present();
        const place = new Place(
          null,
          this.formGroup.value.title,
          this.formGroup.value.description,
          null,
          +this.formGroup.value.price,
          this.formGroup.value.availableFrom,
          this.formGroup.value.availableTo,
          null
        );
        this.service.addPlace(place);
        this.formGroup.reset();
        x.dismiss();
        this.router.navigate(['/places/tabs/offers']);
      });
  }
}
