import { Subscription } from 'rxjs';
import { PlcaeLocation } from './../location';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../place';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  sub: Subscription;
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
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  createOffer() {
    if (this.formGroup.invalid || !this.formGroup.get('image').value) {
      return;
    }
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
          null,
          this.formGroup.value.location
        );
        this.sub = this.service
          .uploadImage(this.formGroup.get('image').value)
          .subscribe((imageData) => {
            place.imageUrl = imageData.imageUrl;
            this.service.addPlace(place);
            this.formGroup.reset();
            x.dismiss();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
  locationPicked(placelocation: PlcaeLocation) {
    this.formGroup.patchValue({ location: placelocation });
  }
  imagePicked(image: string | File) {
    let imageData;
    if (typeof image === 'string') {
      try {
        imageData = base64toBlob(
          image.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (ex) {
        console.log(ex);
        return;
      }
    } else {
      imageData = image;
    }
    this.formGroup.patchValue({ image: imageData });
  }
}
