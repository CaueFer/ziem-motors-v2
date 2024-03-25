import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeonameService {

  constructor(private http: HttpClient) { }


  getCities(cityName: string): Observable<{ name: string, location: LatLng }[]> {
    return this.http.get<any>(`http://api.geonames.org/searchJSON?name_startsWith=${cityName}&country=BR&maxRows=10&username=cauezk`)
      .pipe(
        map((data: any) => {
          return data.geonames
            .filter((city: any) => city.fcl === "P" && city.fcode === "PPL")
            .map((city: any) => ({
              name: `${city.name}, ${city.adminCodes1.ISO3166_2}`,
              location: latLng(city.lat, city.lng)
            }));
        })
      );
  }
}
