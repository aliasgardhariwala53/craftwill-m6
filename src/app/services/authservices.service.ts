import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthservicesService {

  constructor(private _httpservices : HttpService) { }

  login(obj){
    return this._httpservices.post(environment.serverUrl +'users/login',obj);
  }
  signup(obj){
    return this._httpservices.post(environment.serverUrl +'users/signup',obj);
  }
  forgotPassword(obj){
    return this._httpservices.update(environment.serverUrl +'users/forgotPassword',obj);
  }
  resetPassword(obj){
    return this._httpservices.update(environment.serverUrl +'users/resetPassword',obj);
  }
  verifyEmail(obj){
    return this._httpservices.update(environment.serverUrl +'users/verifyEmail',obj);
  }
  loggedIn(){
    return !!localStorage.getItem('user');
  }
}
