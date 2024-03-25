import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeonameService } from '../../core/services/geoname.service';
import { LatLng, latLng } from 'leaflet';


@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent {

  inputValue: string = '';
  selectedCity: string = '';
  selectedCityLoc: LatLng = latLng(-23.5615,-46.6328);
  returnedCitys: string[] = [];
  locations: LatLng[]  = [];
  cityForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private _geonameService: GeonameService) {
    this.cityForm = this.formBuilder.group({
      cityName: ['', Validators.required]
    });
    
  }

  ngOnInit(){
  }


  resetForms(){
    this.cityForm.reset();
  }

  onInput(event: any){
    this.inputValue = event.target.value;

    if(this.inputValue.length > 1 && this.cityForm.controls['cityName'].valid){
      this._geonameService.getCities(this.inputValue)
      .subscribe((data: { name: string, location: LatLng }[]) => {
        this.returnedCitys = data.map(city => city.name);
        this.locations = data.map(city => city.location);
      });

      return;
    }
  }

  onSelectCity(event: any){
    const newValue = event.currentTarget.innerText;

    if(newValue && newValue != ''){
      
      const cityIndex = this.returnedCitys.findIndex(city => city === newValue);
      if (cityIndex !== -1) {
        this.cityForm.controls['cityName'].setValue(newValue);

        const cityLocation = this.locations[cityIndex];
        console.log(`A localização de ${newValue} é: ${cityLocation}`);
  
        
        if (cityLocation) {
          this.selectedCity = newValue;
          //console.log(cityLocation)
          this.selectedCityLoc = latLng(cityLocation);

        } else {
          console.error(`Não foi possível encontrar a localização de ${newValue}`);
        }
      }
    }

  }


}
