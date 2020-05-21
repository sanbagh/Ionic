import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../place';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  offer: Place;
  subscription: any;
  constructor(
    private acRoute: ActivatedRoute,
    private service: PlacesService,
    private router: Router,
    private lc: LoadingController
  ) {}

  ngOnInit() {
    this.acRoute.paramMap.subscribe((x) => {
      if (!x.has('id')) {
        return;
      }
      this.lc.create({ message: 'Loading place. Please wait' }).then((ele) => {
        ele.present();
        this.subscription = this.service
          .getPlace(x.get('id'))
          .subscribe((y) => {
            this.offer = y;
            ele.dismiss();
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
      });
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  saveOffer() {
    if (this.formGroup === null || this.formGroup.invalid) {
      return;
    }
    this.lc.create({ message: 'saving place...' }).then((x) => {
      x.present();
      this.service.updatePlace(
        this.offer.id,
        this.formGroup.value.title,
        this.formGroup.value.description
      );
      this.formGroup.reset();
      x.dismiss();
      this.router.navigate(['/places/tabs/offers']);
    });
  }
}
