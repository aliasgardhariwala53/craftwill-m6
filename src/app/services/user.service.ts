import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _httpServe: HttpService) {}
  getProfile() {
    return this._httpServe.get(environment.serverUrl + 'users/getUser');
  }
  updateProfile(obj) {
    return this._httpServe.update(
      environment.serverUrl + 'users/updateProfile',
      obj
    );
  }

  updatePassword(obj) {
    return this._httpServe.update(
      environment.serverUrl + 'users/updatePassword',
      obj
    );
  }
  imageUpload(obj) {
    return this._httpServe.update(environment.serverUrl + 'users/upload', obj);
  }


  upgradePlanApi(obj) {
    return this._httpServe.post(environment.serverUrl + 'subscription/product', obj);
  }


  paymentApi(obj) {
    return this._httpServe.post(environment.serverUrl + 'subscription/payment', obj);
  }




  // getUserImage() {
  //   return this._httpServe.get(environment.serverUrl + 'users/getProfilepic');
  // }

  
}
