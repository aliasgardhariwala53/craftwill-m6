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
  createMembersperson(obj){
    return this._httpServe.post(environment.serverUrl + "addMember",obj);
  }
  createMemberOrganisation(obj){
    return this._httpServe.post(environment.serverUrl + "addMemberOrganisation",obj);
  }
  addBankAccount(obj){
    return this._httpServe.post(environment.serverUrl + "bankAccount",obj);
  }
  addInvestmentAccont(obj){
    return this._httpServe.post(environment.serverUrl + "storeInvestmentAccount",obj);
  }
  addInsurance(obj){
    return this._httpServe.post(environment.serverUrl + "storepolicy",obj);
  }
  addBusiness(obj){
    return this._httpServe.post(environment.serverUrl + "storeBusiness",obj);
  }
  addRealEstate(obj){
    return this._httpServe.post(environment.serverUrl + "storeEstate",obj);
  }
  addMoterVehicle(obj){
    return this._httpServe.post(environment.serverUrl + "storeVehicle",obj);
  }
  addIntellectualProperty(obj){
    return this._httpServe.post(environment.serverUrl + "storeProperty",obj);
  }
  addpersonalPossession(obj){
    return this._httpServe.post(environment.serverUrl + "storePossession",obj);
  }
  addsafeDepositbox(obj){
    return this._httpServe.post(environment.serverUrl + "storeDeposit",obj);
  }
  addSecuredLoanLiability(obj){
    return this._httpServe.post(environment.serverUrl + "liabilities/storeLoan",obj);
  }
  addUnSecuredLoanLiability(obj){
    return this._httpServe.post(environment.serverUrl + "liabilities/storeUnsecureLoan",obj);
  }
  addprivateDebtLiability(obj){
    return this._httpServe.post(environment.serverUrl + "liabilities/storeDept",obj);
  }
  addTrust(obj){
    return this._httpServe.post(environment.serverUrl + "trust/storeTrust",obj);
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
  getPerson(){
    return this._httpServe.get(environment.serverUrl + "getMember");
  }
  getOrganisation(){
    return this._httpServe.get(environment.serverUrl + "getMemberOrganisation");
  }
  getAssetsDetails(){
    return this._httpServe.get(environment.serverUrl + "asset/getAssets");
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
  getTrust(){
    return this._httpServe.get(environment.serverUrl + "trust/getTrustDetails");
  }
}
