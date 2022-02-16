import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LiabilitiesService {

  constructor(private _httpServe: HttpService) { }
  addLiabilities(obj){
    return this._httpServe.post(environment.serverUrl + "storeLiabilities",obj);
  }
  filterLiabilities(obj){
    return this._httpServe.post(environment.serverUrl + "filterLiabilities",obj);
  }
  updateLiabilities(obj,id){
    return this._httpServe.update(`${environment.serverUrl}UpdateLiabilities/${id}`,obj);
  }
  getAllLiabilities(){
    return this._httpServe.get(environment.serverUrl + "getLiabilities");
  }
  getLiabilitiesData(item) {
    let data = {
      loanName: '',
      loanProvider: '',
      loan_Id_Number: 0,
      actionRoute: '',
    };
    switch (item.type) {
      case 'privateDept':
        data.loanProvider = item.privateDept.dept_Name || '---';
        data.loan_Id_Number = item.privateDept.loan_Id_Number || '---';
        data.loanName = 'Private Dept';
        data.actionRoute = 'liabilities/privateDebt';

        return data;
        break;
      case 'securedLoan':
        data.loanProvider = item.securedLoan.loanProvider || '';
        data.loan_Id_Number = item.securedLoan.loan_Id_Number || '';
        data.loanName = 'Secured Loan';
        data.actionRoute = 'liabilities/securedLoan';
        return data;
        break;
      case 'unsecuredLoan':
        data.loanProvider = item.unsecuredLoan.loanProvider || '---';
        data.loan_Id_Number = item.unsecuredLoan.loan_Id_Number || '---';
        data.loanName = 'Unsecured Loan';
        data.actionRoute = 'liabilities/unSecuredLoan';
        return data;
        break;

        default:
          return data;
    }
  }


}
