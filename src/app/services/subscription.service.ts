import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private _httpServe: HttpService) { }
  canceledSubscription=new BehaviorSubject(false);
  isfreeTrialValid=new BehaviorSubject(false);
  subscriptionAmount=new BehaviorSubject(null);

  subscriptionActive =new BehaviorSubject(false);
  subscriptionDetails =new BehaviorSubject(null);
  subscriptionHistory() {
    return this._httpServe.get(environment.serverUrl + 'subscription/getSubDetails');
  }
  cancelSubscription(obj) {
    return this._httpServe.post(environment.serverUrl + 'subscription/cancelSubPlan',obj);
  }
  upgradePlanApi(obj) {
    return this._httpServe.post(environment.serverUrl + 'subscription/product', obj);
  }


  paymentApi(obj) {
    return this._httpServe.post(environment.serverUrl + 'subscription/payment', obj);
  }
  subscriptionPlan() {
    return this._httpServe.get(environment.serverUrl + 'subscription/plan');
  }
}
