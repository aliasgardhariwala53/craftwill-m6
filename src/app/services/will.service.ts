import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WillService {
  constructor() {}
  step1 = new BehaviorSubject({});
  step2 = new BehaviorSubject({});
  step3 = new BehaviorSubject({});
  step4 = new BehaviorSubject({});
  step5 = new BehaviorSubject({});

  assetsBeneficiary = new BehaviorSubject([]);
// step 3
  step3AssetData = new BehaviorSubject([]);
  //trust
  allTrustAdditionalData = new BehaviorSubject([]);
  step3TrustData = new BehaviorSubject([]);

  allpayoutTrust = new BehaviorSubject([]);

  
}
