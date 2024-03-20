import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly url = 'http://localhost:5050/api/ziemmotors/';
  
  users: any = [];

  constructor(private http: HttpClient){
  }

  ngOnInit(){
    this.getUsers();
    console.log(this.users);
  }

  getUsers(){
    this.http.get(this.url+'getallusers').subscribe(data =>{
      this.users = data;
    })
  }
}
