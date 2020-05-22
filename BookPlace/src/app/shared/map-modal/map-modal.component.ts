import { environment } from './../../../environments/environment';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  @Input() lat = 37.75;
  @Input() lng = -122.41;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.buildMap();
  }
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [this.lng, this.lat],
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
    this.map.on('click', (event) => {
      const coordinates = { lng: event.lngLat.lng, lat: event.lngLat.lat };
      this.modalCtrl.dismiss(coordinates);
    });
    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }
  ngOnDestroy() {}
  onCancel() {
    this.modalCtrl.dismiss();
  }
}
