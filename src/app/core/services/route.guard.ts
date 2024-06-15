import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";


@Injectable()
export class RouteGuard implements CanActivate{

    constructor(private _authService: AuthService, private router: Router){ }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const isAutheticated = this._authService.getIsAutheticated();
        if(!isAutheticated){
            this.router.navigate(['/login']);
        }
        return isAutheticated;
    }

}