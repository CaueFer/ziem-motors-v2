import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  year: number = new Date().getFullYear();
  users: any = [];

  loginForm: FormGroup;
  successmsg: string = '';
  errormsg: string = '';
  submitted: boolean = true;
  hidePassword: boolean = true;
  isSubmited: boolean = false;
  scroolled: boolean = false;

  constructor( private _authService: AuthService, private formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    })

  }

  get f() { return this.loginForm.controls};

  ngOnInit() {
  }

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
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  getInputType() {
    return this.hidePassword ? 'password' : 'text';
  }
  
  resetForms() {
    this.loginForm.reset();
  }

  async verifyLogin(email: User["email"]){
    try{
      await this._authService.verifyEmail(email);
    }catch (error) {
      console.error(error);
      this.errormsg = "Email sem conta cadastrada.";
    }
  }

  submitLogin(){
    this.isSubmited = true;

    if(this.loginForm.invalid){
      this.errormsg = 'Campos invalidos.'
      return;
    }

    if(this.loginForm.valid){
      console.log(this.loginForm.controls['email'].value);
      //this.verifyLogin(this.loginForm.controls['email'].value)
    }

  }
}
