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
      name: ['', [Validators.required]],
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

  resetForms() {
    this.registerForm.reset();

    [this.errormsg, this.successmsg, this.isSubmited] = ['', '', false];
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  getInputType() {
    return this.hidePassword ? 'password' : 'text';
  }
  
  onInput(){
    this.errormsg = '';
  }

  submitSignIn(){
    this.isButtonDisabled = true;
    setTimeout(() => { 
      this.isButtonDisabled = false; 
    }, 1000);

    this.isSubmited = true;



    if(this.f['name'].invalid && this.f['email'].invalid && (this.f['password'].invalid || this.f['passwordConfirm'].invalid)){
      this.errormsg = 'Campos inválidos.';

      return;
    }

    if(this.f['name'].invalid){
      this.errormsg = 'Nome inválido.';

      return;
    }

    if(this.f['email'].invalid){
      this.errormsg = 'Email inválido.';

      return;
    }
    
    if(this.f['password'].value === '' && this.f['passwordConfirm'].value === ''){
      this.errormsg = 'Campo senha vazio.';

      return;
    }

    if(this.f['password'].value !== this.f['passwordConfirm'].value){
      this.errormsg = 'Senhas não coincidem.';
      this.f['password'].setErrors({ 'passwordMismatch': true });
      this.f['passwordConfirm'].setErrors({ 'passwordMismatch': true });

      return;
    }
    else{
      this.errormsg = '';
      this.f['password'].setErrors(null);
      this.f['passwordConfirm'].setErrors(null);
    };
    

    if(this.registerForm.valid){
      this._authService.registerUser(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.password)
      .subscribe({
        next: (data) => {
          if(data) this.successmsg = 'Conta criada com sucesso. ';
          this.registerForm.reset();
        },
        error: (error) =>{
          if(error) this.errormsg = error.message;
        }
      });
    }
    
    this.isSubmited = false;
  }

}
