import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:5050/api/ziemmotors/';

  constructor(private http: HttpClient) { }


  async registerUser(user: User): Promise<any> {
    try{
      const response = this.http.post<any>(this.url + 'adduser', user);
      return response;
    }catch (error) {
      throw error;
    }
  }

  async getAllUser(){
    try {
      const response = this.http.get<any>(this.url + 'getallusers');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(email: User["email"]): Promise<any> {
    try{
      const response = this.http.post<any>(this.url + 'verifyemail', email);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
}
