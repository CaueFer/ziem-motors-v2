import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeonameService } from '../../core/services/geoname.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
})
export class StoresComponent {
  inputValue: string = '';
  selectedCity: string = '';
  returnedCitys: string[] = [];
  locations: [] = [];
  cityForm: FormGroup;

  isDropdownOpen: any;

  cidadesDisponiveis: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _geonameService: GeonameService
  ) {
    this.cityForm = this.formBuilder.group({
      cityName: ['', Validators.required],
    });
  }

  ngOnInit() {}

  eventRecepter(event: any) {
    this.cidadesDisponiveis = event;
  }

  resetForms() {
    this.cityForm.reset();
  }

  onInput(event?: any, customCity?: string) {
    const target = document.getElementById('dropdownCidadeinput');

    if (event !== null) {
      this.inputValue = event.target.value;

      if (
        this.inputValue.length > 1 &&
        this.cityForm.controls['cityName'].valid
      ) {
        target?.classList.add('show');

        this._geonameService
          .getCities(this.inputValue)
          .subscribe((data: { name: string }[]) => {
            this.returnedCitys = data.map((city) => city.name);
          });

        this.returnedCitys.push('Petrópolis, RJ');
        this.returnedCitys.push('Campinas, SP');

        return;
      } else target?.classList.remove('show');
    }

    if (customCity) {
      this.onSelectCity(null, customCity);
    } else this.returnedCitys.length = 0;
  }

  onSelectCity(event?: any, customCity?: string) {

    if (event) this.selectedCity = event;

    if (customCity) this.selectedCity = customCity;
  }
}
