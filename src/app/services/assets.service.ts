import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private _httpServe: HttpService) { }
  addAssets(obj){
    return this._httpServe.post(environment.serverUrl + "storeAssets",obj);
  }
  getAssets(){
    return this._httpServe.get(environment.serverUrl + "getAssets");
  }
  updateAssets(obj,id){
    return this._httpServe.update(`${environment.serverUrl}updateAssets/${id}`,obj);
  }
  filterAssets(obj){
    return this._httpServe.post(environment.serverUrl + "filterAssets",obj);
  }
  getAssetsData(item) {
    let data = {
      name: '',
      uniqueNumber: '',
      actionRoute:'',
      img:'',
    };
    switch (item.type) {
      case 'business':
        data.uniqueNumber = item.business.UEN_no || '---';
        data.name = 'Business';
        data.actionRoute = '/assets/business';
        data.img='assets/Icons/Business.svg'
        return data;
        break;
      case 'intellectualProperty':
        data.uniqueNumber = item.intellectualProperty.ip_No || '';
        data.name = 'Intellectual Property';
        data.actionRoute = '/assets/intellectualProperty';
        data.img='assets/Icons/Intellectual property.svg'
        return data;
        break;
      case 'insurancePolicy':
        data.uniqueNumber = item.insurancePolicy.policyNumber || '---';
        data.name = 'Insurance Policy';
        data.actionRoute = '/assets/insurancePolicy';
        data.img='assets/Icons/Insurance Policy.svg'
        return data;
        break;
      case 'bankAccount':
        data.uniqueNumber = item.bankAccount.accountNumber || '---';
        data.name = 'Bank Account';
        data.actionRoute = '/assets/addBank';
        data.img='assets/Icons/Bank Account.svg'
        return data;
        break;
      case 'safeDepositBox':
        data.uniqueNumber = item.safeDepositBox.safe_No || '---';
        data.name = 'Safe Deposit Box';
        data.actionRoute = '/assets/safeDeposit';
        data.img='assets/Icons/Safe Deposite Box.svg'
        return data;
        break;
      case 'realEstate':
        data.uniqueNumber = item.realEstate.accountNumber || '---';
        data.name = 'Real Estate';
        data.actionRoute = '/assets/realEstate';
        data.img='assets/Icons/Real Estate.svg'
        return data;
        break;
      case 'personalPossession':
        data.uniqueNumber = item.personalPossession.id_No || '---';
        data.name = 'Personal Possession';
        data.actionRoute = '/assets/personalPossession';
        data.img='assets/Icons/Personal Possession.svg'
        return data;
        break;
      case 'investmentAccount':
        data.uniqueNumber = item.investmentAccount.accountNo || '---';
        data.name = 'Investment Account';
        data.actionRoute = '/assets/investmentAccount';
        data.img='assets/Icons/Investment Account.svg'
        return data;
        break;
      case 'motorVehicle':
        data.uniqueNumber = item.motorVehicle.plateNo || '---';
        data.name = 'Motor Vehicle';
        data.actionRoute = '/assets/moterVehicle';
        data.img='assets/Icons/Motor.svg'
        return data;
        break;
      default:
        return data;
    }
  }
}
