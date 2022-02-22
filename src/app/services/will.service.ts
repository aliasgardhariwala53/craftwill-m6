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
  benificiaryAdder(value, type) {
    let GiftBenificiary=[];
    this.assetsBeneficiary.subscribe((data) => {
      GiftBenificiary= data.map((el) => {
        if (el.type === type) {
          return { ...value };
        } else {
          return el;
        }
      });
    });
    this.assetsBeneficiary.next(GiftBenificiary);
  }
}
