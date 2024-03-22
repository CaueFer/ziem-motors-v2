import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeonameService {

  constructor(private http: HttpClient) { }

  convertStateToSigla(code: string): string {
    const stateCodes: { [key: string]: string } = {
      '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP', '17': 'TO',
      '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL',
      '28': 'SE', '29': 'BA', '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP', '41': 'PR',
      '42': 'SC', '43': 'RS', '50': 'MS', '51': 'MT', '52': 'GO', '53': 'DF'
    };
    return stateCodes[code] || '';
  }


  getCities(cityName: string): Observable<string[]> {
    return this.http.get<any>(`http://api.geonames.org/searchJSON?name_startsWith=${cityName}&country=BR&maxRows=10&username=cauezk`)
      .pipe(
        map((data: any) => {
          return data.geonames
            .filter((city: any) => city.fcl === "P" && city.fcode === "PPL")
            .map((city: any) => `${city.name}, ${city.adminCodes1.ISO3166_2}`);
        })
      );
  }
}
