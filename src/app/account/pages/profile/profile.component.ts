import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;
  @ViewChild('infosModal') infosModal!: TemplateRef<any>;
  modalRef!: BsModalRef;

  private getUserSub!: Subscription;
  public userModel: UserModel = {} as UserModel;

  userInfos: FormGroup;


  constructor(private _authService: AuthService, private _modalService: BsModalService, private formBuilder: FormBuilder){

    this.userInfos = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      imagem: ['']
    });

   }

  ngOnDestroy(): void {
    this.getUserSub.unsubscribe();
  }

  ngOnInit(): void {
    
    this.getUserSub = this._authService.getUser().subscribe(data =>{

      this.userModel = {
        name: data.userInfos.name,
        email: data.userInfos.email,
        image: data.userInfos.image,
        telefone: data.userInfos.telefone,
        endereco: data.userInfos.endereco
      };

      this.attInputs();

      //console.log(this.userModel);
    });

    
  }

  onSubmitInfos(){
    this.modalRef.hide();

    const name = this.userInfos.value.name;
    const email = this.userInfos.value.email;
    const image = this.userInfos.value.image;
    const endereco = this.userInfos.value.endereco;
    const telefone = this.userInfos.value.telefone;

    this._authService.updateUser(name, email, image, endereco, telefone);
  }

  openModal(modal: string) {

    if(modal === 'logout') this.modalRef = this._modalService.show(this.logoutModal);

    if(modal === 'infos') this.modalRef = this._modalService.show(this.infosModal);

  }

  logout() {
    this.modalRef.hide();

    this._authService.logout();
  }

  attInputs(){
    
    this.userInfos.patchValue({
      name: this.userModel.name,
      email: this.userModel.email,
      image: this.userModel.image,
      endereco: this.userModel.endereco,
      telefone: this.userModel.telefone
    });
  }
}
