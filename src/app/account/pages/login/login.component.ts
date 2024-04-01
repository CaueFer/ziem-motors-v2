import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{
  year: number = new Date().getFullYear();
  users: any = [];

  loginForm: FormGroup;
  successmsg: string = '';
  errormsg: string = '';
  submitted: boolean = true;
  hidePassword: boolean = true;
  isSubmited: boolean = false;
  scroolled: boolean = false;

  private authenticatedSub!: Subscription;
  private isAuthenticated: boolean = false;

  continueLogged: boolean = false;

  constructor( private _authService: AuthService, private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    })
  }
  get f() { return this.loginForm.controls};

  ngOnDestroy(): void {
    this.authenticatedSub.unsubscribe();
  }

  ngOnInit() { 

    // this.isAuthenticated = this._authService.getIsAutheticated();
    // if(this.isAuthenticated){
    //   this.router.navigate(['profile']);
    // }
    this.authenticatedSub = this._authService.getAuthentication().subscribe(data => {
      if(data){
        this.isAuthenticated = data;
        this.router.navigate(['profile']);
      }
    })

    this._authService.authFromLocalStorage();
  };

  windowScroll() {
    const navbar = document.getElementById('bgSectionMask');

    if(navbar){
      if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
        navbar.classList.add('full')
        this.scroolled = true;
      } else {
        navbar.classList.remove('full')
        this.scroolled = false;
      }
    }
  };

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  };

  getInputType() {
    return this.hidePassword ? 'password' : 'text';
  };
  
  resetForms() {
    this.loginForm.reset();
  };


  submitLogin(){
    this.isSubmited = true;

    if(this.loginForm.invalid){
      this.errormsg = 'Campos invalidos.';

      return;
    }

    if(this.loginForm.valid){
      
      this._authService.loginUser(this.f['email'].value, this.f['password'].value, this.continueLogged);
    }
  };

  checkBoxInput(target: any){
    let isChecked = target.checked;
    isChecked ? this.continueLogged = true: this.continueLogged = false;
  }
}
