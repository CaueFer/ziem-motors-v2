import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  year: number = new Date().getFullYear();
  users: any = [];

  registerForm: FormGroup;
  successmsg: string = '';
  errormsg: string = '';
  submitted: boolean = true;
  hidePassword: boolean = true;
  isSubmited: boolean = false;
  scroolled: boolean = false;
  isButtonDisabled: any;

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

    [this.errormsg, this.successmsg, this.isSubmited] = ['', '', false];
  }

  onSubmitBtnClick() {
    this.isButtonDisabled = true;
    setTimeout(() => { 
      this.isButtonDisabled = false; 
    }, 1500);
  }

  submitSignIn(){
    this.isSubmited = true;

    if(this.registerForm.invalid){

      this.errormsg = 
      this.f['email'].invalid && this.f['password'].invalid && this.f['passwordConfirm'].invalid ? 'Campos inválidos.' :
      this.f['email'].invalid && this.f['password'].valid && this.f['passwordConfirm'].valid ? 'Email inválido.' :
      this.f['email'].valid && (this.f['password'].invalid || this.f['passwordConfirm'].invalid) ? 'Senhas inválidas.' :
        'Campos inválidos.';

      return;
    }

    if(this.f['password'].value != this.f['passwordConfirm'].value){
      this.errormsg = 'Senhas não coIncidem.';
      this.f['password'].setErrors({ 'passwordMismatch': true });
      this.f['passwordConfirm'].setErrors({ 'passwordMismatch': true });
      return;
    } 

    this._authService.registerUser(this.registerForm.value.email, this.registerForm.value.password);
    
    this.isSubmited = false;
  }

}
