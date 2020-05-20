import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  formGroup: FormGroup;
  constructor() {}

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
  createOffer() {}
}
