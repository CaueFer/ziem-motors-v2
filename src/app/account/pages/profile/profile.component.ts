import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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


  constructor(private _authService: AuthService, private _modalService: BsModalService){ }

  ngOnDestroy(): void {
    this.getUserSub.unsubscribe();
  }

  ngOnInit(): void {
    
    this.getUserSub = this._authService.getUser().subscribe(data =>{

      this.userModel.name = data.userInfos.name;
      this.userModel.email = data.userInfos.email;
      this.userModel.image = data.userInfos.image;
      //console.log(this.userModel);
    });

    
  }

  onSubmitInfos(){

    //this._authService.updateUser('caue123@gma' );
  }

  openModal(modal: string) {

    if(modal === 'logout') this.modalRef = this._modalService.show(this.logoutModal);

    if(modal === 'infos') this.modalRef = this._modalService.show(this.infosModal);


  }

  logout() {
    this._authService.logout();
  }
}
