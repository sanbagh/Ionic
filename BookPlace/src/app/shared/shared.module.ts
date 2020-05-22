import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@NgModule({
  declarations: [MapModalComponent, LocationPickerComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  entryComponents: [MapModalComponent],
  exports: [MapModalComponent, LocationPickerComponent],
})
export class SharedModule {}
