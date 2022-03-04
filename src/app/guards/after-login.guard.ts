import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthservicesService } from '../services/authservices.service';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginGuard implements CanActivate {
  constructor(private _authService:AuthservicesService,private _router:Router){
  }
canActivate(){
      if(!localStorage.getItem("user")){
        return true;
      }
      else{
        this._router.navigate(["/home"]);
        return false;
      }
    }
  
}
