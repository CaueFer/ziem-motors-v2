import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:5050/api/ziemmotors/';

  private jwtToken!: string;
  private authenticationSub = new Subject<boolean>();
  private isAutheticated = false;


  constructor(private http: HttpClient, private router: Router) { }

  getIsAutheticated(){
    return this.isAutheticated;
  }
      
  getAuthentication(){
    return this.authenticationSub.asObservable();
  }

  getToken(){
    return this.jwtToken;
  }

  async registerUser(email: string, password: string){

    const userData: UserModel = {email: email, password: password}

    this.http.post(this.url+'signin', userData).subscribe(data =>{
      console.log(data);
    })

  }

  async loginUser(email: string, password: string){

    const userData: UserModel = {email: email, password: password}

    this.http.post<{token: string}>(this.url+'login', userData).subscribe(data => {
      //console.log(data);
      this.jwtToken = data.token;
      if(this.jwtToken){
        this.authenticationSub.next(true);
        this.isAutheticated = true;
      }
    })
  }
  
}
