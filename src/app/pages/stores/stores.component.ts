import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { latLng, marker, tileLayer } from 'leaflet';
import { GeonameService } from '../../core/services/geoname.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent {
  selectedCity: string = '';
  returnedCitys: string[] = [];
  cityForm: FormGroup;
  isBrowser: any;

  mapOptions: any;
  mapLayersControl: any;
  layersJvl: any;
  layersCwb: any;
  
  constructor(private formBuilder: FormBuilder, private _geonameService: GeonameService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.cityForm = this.formBuilder.group({
      cityName: ['', Validators.required]
    });
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initializeMap();
    }
    
  }

  ngOnInit(){
  }

  private initializeMap() {
    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 3, maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(-14.817, -52.91)
    };

    this.layersJvl = [
      marker([-26.30067, -48.84659]).bindPopup('Jonville-centro'),
      marker([-26.2930, -48.8681]).bindPopup('Jonville-gloria')
    ];

    this.layersCwb = [
      marker([-25.4416, -49.2436]).bindPopup('Curitiba-centro'),
      marker([-25.4012, -49.2843]).bindPopup('Curitiba-norte')
    ];

    this.mapLayersControl = {
      baseLayers: {
        'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 3, maxZoom: 18, attribution: '...' })
      },
      overlays: {}
    };
  }

  onInput(event: any){
    const value = event.target.value;

    if(value.length > 1 && this.cityForm.controls['cityName'].valid){
      this._geonameService.getCities(value)
      .subscribe((data: string[]) => {
        this.returnedCitys = data;
      });

      console.log(this.returnedCitys);
      return;
    }

  }

  resetForms(){
    this.cityForm.reset();
  }

  onSubmit() {

    if(this.cityForm.controls['cityName'].value){
      this.selectedCity = this.cityForm.controls['cityName'].value;
    }
  }

}
