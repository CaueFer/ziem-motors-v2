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
  @ViewChild('saveInfosModal') saveinfosModal!: TemplateRef<any>;
  modalRef!: BsModalRef;

  private getUserSub!: Subscription;
  public userModel: UserModel = {} as UserModel;

  userInfos: FormGroup;
  imgUser!: string;
  inputsChanged: { [key: string]: boolean } = {};
  successAtt: boolean = false;
  isLoading: boolean = false;

  constructor(private _authService: AuthService, private _modalService: BsModalService, private formBuilder: FormBuilder){

    this.userInfos = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      image: ['']
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
    })
  };

  onSubmitInfos(){
    if(this.modalRef) this.modalRef.hide();

    const { name, email, image, endereco, telefone } = this.userInfos.value;
    //console.log(image);
    this._authService.updateUser(name, email, image, endereco, telefone).subscribe(res =>{
      this.isLoading = true;
      this.openModal('saveinfos');
      if(res){
        this.clearObjectsOfInputs();

        setTimeout(() => { this.isLoading = false; }, 1500);
        setTimeout(() => { this.modalRef.hide(); }, 2000);
        setTimeout(() => { this.successAtt = false; }, 3000);
      }
    })
  }

  openModal(modal: string) {

    if(modal === 'logout') this.modalRef = this._modalService.show(this.logoutModal);
    if(modal === 'infos') this.modalRef = this._modalService.show(this.infosModal);
    if(modal === 'saveinfos') this.modalRef = this._modalService.show(this.saveinfosModal, {class: 'modal-dialog-centered'});
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
    this.imgUser = this.userInfos.value.image;
  }

  getInputsChangedLength(): number {
    let i = 0;
    Object.keys(this.inputsChanged).forEach(key => {
      if(this.inputsChanged[key] === true) i++;
    });
    return i;
  };

  clearObjectsOfInputs(){
    Object.keys(this.inputsChanged).forEach(key => {
      this.inputsChanged[key] = false;
    });
  };

  async onFileSelected(event: any): Promise<void> {
    const selectedFile: File = event.target.files[0];
    const base64 = await this.convertToBase64(selectedFile);
    this.userInfos.patchValue({ image: base64 });
    this.imgUser = base64;
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
