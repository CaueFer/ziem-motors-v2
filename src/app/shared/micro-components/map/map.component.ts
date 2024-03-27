import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, afterNextRender } from '@angular/core';
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
  layerPetro: any;
  layerCampinas: any;

  private _selectedCity: string = '';

  @Output() temLojas = new EventEmitter<string[]>();

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

      this.temLojas.emit(['Joinville, SC', 'Petrópolis, RJ', 'Campinas, SP']);

      this.layerJvll = [
        marker([ -26.2747,-48.8631 ]),
        marker([ -26.3030,-48.8427 ]),

      ];
      this.layerPetro = [
        marker([ -22.5082,-43.1763 ]),
        marker([ -22.5248,-43.1987 ]),
        marker([ -22.4952,-43.1618 ]),
      ];
      this.layerCampinas = [
        marker([ -22.8959,-47.0653 ]),
        marker([ -22.9388,-47.0641 ]),
        marker([ -22.8022,-47.0513 ]),
      ];
    } else {
      console.log('Tela maps não carregada.');
    }
  }

}
