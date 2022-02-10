import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _httpServe: HttpService) {}
  getProfile() {
    return this._httpServe.get(environment.serverUrl + "users/getUser");
  }
  updateProfile(obj) {
    return this._httpServe.update(
      environment.serverUrl + 'users/updateProfile',
      obj
    );
  }
  createMembers(obj){
    return this._httpServe.post(environment.serverUrl + "createMember",obj);
  }
  
  addAssets(obj){
    return this._httpServe.post(environment.serverUrl + "storeAssets",obj);
  }

  addLiabilities(obj){
    return this._httpServe.post(environment.serverUrl + "storeLiabilities",obj);
  }

  addTrust(obj){
    return this._httpServe.post(environment.serverUrl + "trust/storeTrust",obj);
  }
  
  filterAssets(obj){
    return this._httpServe.post(environment.serverUrl + "filterAssets",obj);
  }
  filterLiabilities(obj){
    return this._httpServe.post(environment.serverUrl + "filterLiabilities",obj);
  }
  filterMembers(obj){
    return this._httpServe.post(environment.serverUrl + "filterMembers",obj);
  }
  filterTrust(obj){
    return this._httpServe.post(environment.serverUrl + "trust/filterTrust",obj);
  }




  updatePassword(obj){
    return this._httpServe.update(environment.serverUrl + "users/updatePassword",obj);
  }
  imageUpload(obj){
    return this._httpServe.update(environment.serverUrl + "users/upload",obj);
  }
  getUserImage(){
    return this._httpServe.get(environment.serverUrl + "users/getProfilepic");
  }
  getMembers(){
    return this._httpServe.get(environment.serverUrl + "getMembers");
  }
  getOrganisation(){
    return this._httpServe.get(environment.serverUrl + "getMemberOrganisation");
  }
  getAssets(){
    return this._httpServe.get(environment.serverUrl + "getAssets");
  }
  getSecuredLoan(){
    return this._httpServe.get(environment.serverUrl + "liabilities/getLoanDetails");
  }
  getUnSecuredLoan(){
    return this._httpServe.get(environment.serverUrl + "liabilities/getUnsecureLoanDetails");
  }
  getPrivateDebt(){
    return this._httpServe.get(environment.serverUrl + "liabilities/getDeptDetails");
  }
  getAllLiabilities(){
    return this._httpServe.get(environment.serverUrl + "getLiabilities");
  }
  getTrust(){
    return this._httpServe.get(environment.serverUrl + "trust/getTrustDetails");
  }

  updateLiabilities(obj,id){
    return this._httpServe.update(`${environment.serverUrl}UpdateLiabilities/${id}`,obj);
  }
  updateAssets(obj,id){
    return this._httpServe.update(`${environment.serverUrl}updateAsets/${id}`,obj);
  }
  updateMembers(obj,id){
    return this._httpServe.update(`${environment.serverUrl}updateMember/${id}`,obj);
  }
  updateTrust(obj,id){
    return this._httpServe.update(`${environment.serverUrl}trust/updateTrust/${id}`,obj);
  }
}
