import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthservicesService } from '../services/authservices.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private _authService:AuthservicesService,private _Router:Router){
}
 
canActivate() {
  if (this._authService.loggedIn()) {
    return true;
  }
  else{
    this._Router.navigate(['/']);
    return false;
  }
}
}
