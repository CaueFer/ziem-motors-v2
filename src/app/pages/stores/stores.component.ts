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

  cidadesDisponiveis: string[] = [];

  constructor(private formBuilder: FormBuilder, private _geonameService: GeonameService) {
    this.cityForm = this.formBuilder.group({
      cityName: ['', Validators.required]
    });
    
  }

  ngOnInit(){
  }

  eventRecepter(event: any){
    this.cidadesDisponiveis = event;
  }

  resetForms(){
    this.cityForm.reset();
  }

  onInput(event?: any, customCity?: string){
    const target = document.getElementById('dropdownCidadeinput');

    if(event !== null){
      this.inputValue = event.target.value;

      if(this.inputValue.length > 1 && this.cityForm.controls['cityName'].valid){
        target?.classList.add('show');
  
        this._geonameService.getCities(this.inputValue)
        .subscribe((data: { name: string, location: LatLng }[]) => {
          this.returnedCitys = data.map(city => city.name);
          this.locations = data.map(city => city.location);
        });
        
        return;
      } else target?.classList.remove('show');
    }

    if(customCity){
      let onlyCityName = customCity.split(',')[0].trim().toLowerCase();

      this._geonameService.getCities(onlyCityName)
        .subscribe((data: { name: string, location: LatLng }[]) => {
          this.returnedCitys = data.map(city => city.name);
          this.locations = data.map(city => city.location);

          this.onSelectCity(null, customCity);
        });

    } else this.returnedCitys.length = 0;
    
  }

  onSelectCity(event?: any, customCity?: string){
    const target = document.getElementById('dropdownCidadeinput');
    let newValue = '';

    if(event) newValue = event.currentTarget.innerText;
    if(customCity) newValue = customCity;

    if(newValue && newValue != ''){
      target?.classList.remove('show');
      
      const cityIndex = this.returnedCitys.findIndex(city => city === newValue);
      if (cityIndex !== -1) {
        this.cityForm.controls['cityName'].setValue(newValue);

        const cityLocation = this.locations[cityIndex];
        console.log(`A localização de ${newValue} é: ${cityLocation}`);
  
        
        if (cityLocation) {
          this.selectedCity = newValue;
          this.selectedCityLoc = latLng(cityLocation);

          //console.log(cityLocation)
        } else {
          console.error(`Não foi possível encontrar a localização de ${newValue}`);
        }
      }
    }

  }


}
