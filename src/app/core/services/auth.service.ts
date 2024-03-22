import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:5050/api/ziemmotors/';

  constructor(private http: HttpClient) { }

  async registerUser(email: string, password: string){

    const userData: UserModel = {email: email, password: password}

    this.http.post(this.url+'signin', userData).subscribe(data =>{
      console.log(data);
    })

  }
  
}
