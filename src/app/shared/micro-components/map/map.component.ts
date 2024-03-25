import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, afterNextRender } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LatLng, Layer, MapOptions, latLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  options!: MapOptions;
  layersControl: any; 
  layerJvll: any;
  layerCwb: any;
  layerSP: any;

  private _selectedCity: string = '';

  @Input()
  get selectedCity(): string {
    return this._selectedCity;
  }
  set selectedCity(value: string) {
    this._selectedCity = value.toLowerCase(); 
  }
  @Input() newCenter: LatLng = latLng(0,0)

  minZoom: number = 3;
  maxZoom: number = 18;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnChanges() {
    //console.log(this.selectedCity, this.newCenter);

    if (isPlatformBrowser(this.platformId)) {
      this.options = {
        layers: [
          tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', { minZoom: this.minZoom, maxZoom: this.maxZoom, attribution: '<a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia Maps</a>' })
        ],
        zoom: 7,
        center: this.newCenter,
      };

      this.layersControl = {
        baseLayers: {
          'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {  minZoom: this.minZoom, maxZoom: this.maxZoom, attribution: '© OpenStreetMap contributors' }),
          'Wiki Map': tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {  minZoom: this.minZoom, maxZoom: this.maxZoom, attribution: '<a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia Maps</a>' })
        },
        overlays: {
        }
      };

      this.layerJvll = [
        marker([ -26.2747,-48.8631 ]),
        marker([ -26.3030,-48.8427 ]),

      ];
      this.layerCwb = [
        marker([ -25.3901,-49.2975 ]),
        marker([ -25.4294,-49.2647 ]),
        marker([ -25.4812,-49.3236 ]),
      ];
      this.layerSP = [
        marker([ -23.5826,-46.7468 ]),
        marker([ -23.5536,-46.5978 ]),
        marker([ -23.4998,-46.6030 ]),
      ];
    } else {
      console.log('Tela não carregada.');
    }
  }

}
