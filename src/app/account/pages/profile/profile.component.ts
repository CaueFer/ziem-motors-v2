import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {


  private getUserSub!: Subscription;
  public userModel: UserModel = {} as UserModel; 

  constructor(private _authService: AuthService){ }

  ngOnDestroy(): void {
    this.getUserSub.unsubscribe();
  }

  ngOnInit(): void {
    
    this.getUserSub = this._authService.getUser().subscribe(data =>{

      this.userModel.name = data.userInfos.userName;
      this.userModel.email = data.userInfos.userEmail;
      //console.log(this.userModel);
    });
  }
}
