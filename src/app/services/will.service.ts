import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class WillService {
  constructor(private _httpservices : HttpService) {}
  globalReload = new BehaviorSubject(true);
  willpresent = new BehaviorSubject(false);
  currentStep = new BehaviorSubject(1);
  step1 = new BehaviorSubject({});
  step2 = new BehaviorSubject({});
  step3 = new BehaviorSubject({});
  step4 = new BehaviorSubject({});
  step5 = new BehaviorSubject({});

  assetsBeneficiary = new BehaviorSubject([]);
  assetsResidualType = new BehaviorSubject([]);

// step 3
  step3AssetData = new BehaviorSubject([]);

  //trust
  allTrustAdditionalData = new BehaviorSubject([]);
  step3TrustData = new BehaviorSubject([]);

  allpayoutTrust = new BehaviorSubject([]);
//step 5
 delayPayoutData= new BehaviorSubject(null);
 recommendedAdvisorData= new BehaviorSubject([]);
 finalWordsData= new BehaviorSubject(null);
 translationData= new BehaviorSubject(null);
 customClauseData= new BehaviorSubject(null);

 latestWillId= new BehaviorSubject(null);


 memberdata = new BehaviorSubject(null);

 createWill(obj){
  return this._httpservices.post(environment.serverUrl +"will/storeWill",obj);
}

getAllWill(){
  return this._httpservices.get(environment.serverUrl + "will/getWillDetails");
}
updateWill(obj,id){
  return this._httpservices.update(`${environment.serverUrl}will/updateWill/${id}`,obj);
}
deleteWill(id){
  return this._httpservices.delete(`${environment.serverUrl}will/deleteWillById/${id}`);
}
}
