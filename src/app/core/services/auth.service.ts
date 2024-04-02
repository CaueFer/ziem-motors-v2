import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'http://localhost:5050/api/ziemmotors/';

  private jwtToken!: string;
  private authenticationSub = new Subject<boolean>();
  private isAutheticated = false;
  logoutTimer: any;

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

  registerUser(name: string, email: string, password: string): Observable<string> {
    const userData: UserModel = { name: name.toLocaleLowerCase(), email: email, password: password };
  
    return this.http.post<any>(this.url + 'signin', userData).pipe(
      map(data => data.message),
      catchError(error => {
        //console.log(error)
        let errorMessage = '';
        if (error.error && error.error.error.errors.email) {
   
          let errormsg = error.error.error.errors.email.message;

          if(errormsg.includes('Error, expected `email` to be unique.')) errorMessage = 'email já cadastrado.';
        } 
        else errorMessage = 'Erro ao criar conta. Por favor, tente novamente mais tarde.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  loginUser(email: string, password: string, continueLogged: boolean): Observable<any>{
    const userData: UserModel = {email: email, password: password}

    return this.http.post<{token: string, expiresIn: number}>(this.url+'login', userData).pipe(
      map(data => {
        this.jwtToken = data.token;
        if(this.jwtToken){
          this.authenticationSub.next(true);
          this.isAutheticated = true;
          this.logoutTimer = setTimeout(() => {this.logout()}, data.expiresIn * 1000);
  
          const now = new Date();
          const expiresDate = new Date(now.getTime() + (data.expiresIn * 1000));
  
          if(continueLogged) this.addToLocalstorage(this.jwtToken, expiresDate);
        }
      }),
      catchError(error => {
        //console.log(error)
        let errorMessage = '';
        if(error.error.message){
          let errormsg = error.error.message;

          if(errormsg.includes('User/Email not found')) errorMessage = 'Email não cadastrado';
          if(errormsg.includes('Incorrect password')) errorMessage = 'Senha incorreta';
        }
        else errorMessage = 'Erro ao validar conta. Por favor, tente novamente mais tarde.';

        return throwError(() => new Error(errorMessage));
      })
    )
  }
  
  getUser(): Observable<any> {
    return this.http.get<any>(this.url + 'getUser');
  }

  updateUser( name?: string, email?: string, img?: Blob, endereco?: string, telefone?: string,){

    const userData: UserModel = {
      name: name ? name : undefined,
      email: email ? email : undefined,
      image: img,
      endereco: endereco ? endereco : undefined,
      telefone: telefone ? telefone : undefined,
    };

    //console.log(img);

    return this.http.put(this.url+'updateUser', userData).pipe(
      map((data: any) => {
        if (data && data.message) {
          return true; 
        } else {
          return false; 
        }
      })
    );
  }

  logout() {
    this.jwtToken = '';
    this.authenticationSub.next(false);
    this.isAutheticated = false;
    this.router.navigate(['/']);

    clearTimeout(this.logoutTimer);
    this.clearFromLocalstorage();
  }

  addToLocalstorage(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toISOString());
  }

  clearFromLocalstorage(){
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
  }

  getLocalStorageData(){
      const token = localStorage.getItem('token');
      const expiresIn = localStorage.getItem('expiresIn');

      if(!token || !expiresIn){
          return;
      }
      return {
          'token': token,
          'expiresIn': new Date(expiresIn)
      }
  }

  authFromLocalStorage(){
      const localStorageData = this.getLocalStorageData();

      //console.log(localStorageData)
      if(localStorageData){
          const now = new Date();
          const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

          if(expiresIn > 0){
              this.jwtToken = localStorageData.token;
              this.isAutheticated = true;
              this.authenticationSub.next(true);
              this.logoutTimer = setTimeout(() => {this.logout()}, expiresIn);
          }
      }
  }
}
