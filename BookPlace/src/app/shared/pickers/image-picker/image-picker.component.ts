import { Platform } from '@ionic/angular';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Camera,
  CameraResultType,
  Capacitor,
  CameraSource,
} from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImageUrl = '';
  @ViewChild('file') inputEle: ElementRef<HTMLInputElement>;
  usePiker = false;
  @Output() pickedImage = new EventEmitter<string | File>();
  constructor(private platfrom: Platform) {}

  ngOnInit() {
    if (
      (this.platfrom.is('mobile') && !this.platfrom.is('hybrid')) ||
      this.platfrom.is('desktop')
    ) {
      this.usePiker = true;
    }
  }
  async onPickPic() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.inputEle.nativeElement.click();
      return;
    }
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        source: CameraSource.Prompt,
        correctOrientation: true,
        height: 300,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      if (image !== null) {
        this.selectedImageUrl = image.dataUrl;
        this.pickedImage.emit(this.selectedImageUrl);
      }
    } catch (ex) {
      console.log(ex);
      if (this.usePiker) {
        this.inputEle.nativeElement.click();
      }
    }
  }
  onChange(event: any) {
    const pickedImage = event.target.files[0];
    if (!pickedImage) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      this.selectedImageUrl = fr.result.toString();
      this.pickedImage.emit(this.selectedImageUrl);
    };
    fr.readAsDataURL(pickedImage);
  }
}
