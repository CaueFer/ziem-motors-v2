import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  year: number = new Date().getFullYear();
  users: any = [];

  newUser: User = {
    name: '',
    email: '',
    password: '',
  };

  registerForm: FormGroup;
  successmsg: string = '';
  errormsg: string = '';
  submitted: boolean = true;
  hidePassword: boolean = true;
  isSubmited: boolean = false;
  scroolled: boolean = false;

  constructor( private _authService: AuthService, private formBuilder: FormBuilder) {

    this.registerForm = this.formBuilder.group({
      nome: [''],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    })

  }

  get f() { return this.registerForm.controls};

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
    this.registerForm.reset();
  }

  async registerUser(user: User) {
    try {
      await this._authService.registerUser(user);
      this.successmsg = "Registro concluido.";
    } catch (error) {
      console.error(error);
      this.errormsg = "Erro ao registrar usuário:";
    }
  }

  submitSignIn(){
    this.isSubmited = true;

    if(this.registerForm.invalid){
      this.errormsg = 'Campos invalidos.'
      return;
    }

    if(this.f['password'].value != this.f['passwordConfirm'].value){
      this.errormsg = 'Senha não coIncidem.'
      return;
    } 

    this.newUser.name = ' ';
    this.newUser.email = this.registerForm.controls['email'].value;
    this.newUser.password = this.registerForm.controls['password'].value;

    this.registerUser(this.newUser);

    console.log(this._authService.getAllUser());
    
    this.isSubmited = false;
  }

}
