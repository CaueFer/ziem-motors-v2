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
  inputsChanged: { [key: string]: boolean } = {};
  successAtt: boolean = false;

  constructor(private _authService: AuthService, private _modalService: BsModalService, private formBuilder: FormBuilder){

    this.userInfos = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      imagem: ['']
    });

    this.userInfos.valueChanges.subscribe(() => {
      Object.keys(this.userInfos.controls).forEach(key => {
        if (this.userInfos.controls[key].dirty) {
          this.inputsChanged[key] = true;
        }
      });
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

    const { name, email, image, endereco, telefone } = this.userInfos.value;
    this._authService.updateUser(name, email, image, endereco, telefone).subscribe(res =>{

      console.log(res);
      if(res){
        this.clearObjectsOfInputs();
        this.successAtt = true;
      }
    })

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

  getInputsChangedLength(): number {
    return Object.values(this.inputsChanged).length;
  }

  clearObjectsOfInputs(){
    Object.keys(this.inputsChanged).forEach(key => {
      this.inputsChanged[key] = false;
    });
  }
}
