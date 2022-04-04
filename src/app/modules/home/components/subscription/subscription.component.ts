import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { duration } from 'moment';
import { HeaderService } from 'src/app/services/header.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  toggleModalCancel: boolean = false;
  toggleModalChange: boolean = false;
  constructor(private subscription : SubscriptionService, public _headerServ: HeaderService) { }
  isAnyActiveSubscription=false;
  isfreeTrialValid=true;
  allsubscriptionPlans=[];
  subscriptionPlans=[];
  plandetails : any ;
  // obj = {
  //   planPrice: null,
  //   pricePlan: null,
  // };
  obj = {
    planPrice: null,
    pricePlan: null,
    priceId: null,

  };
  currentPlan={
    startDate: moment(new Date()).format("dddd,Do MMMM YYYY"),
    endDate:moment(new Date()).format("dddd,Do MMMM YYYY"),
    amount:0,
    priceId:'',
    isActive:null,
    _id:'',
    isCancelled:null,
  };
  cancelSubscription(){
    //console.log("cancel");
    this.toggleModalCancel= false;
if (this.currentPlan['_id']) {
  
  this.subscription.cancelSubscription({_id:this.currentPlan['_id']}).subscribe((result)=>{
    console.log(result);
    if (result.success) {
      this.subscription.canceledSubscription.next(result.success); 
      this.subscription.subscriptionDetails.next({
        ...this.currentPlan,
        isCancelled:result?.data?.isCancelled,  
      })
      var a = moment(result?.data?.subscriptionEndDate || new Date());
      var b = moment(new Date());
      this.endDays =a.diff(b, 'days');
    }
  })
}
}
  changeSubscription(){
    //console.log("cancel");
    this.toggleModalChange= false;
  }
  endDays=0;

  payment = false ;
  upgradePlan(){
    // this.userService.upgradePlanApi(this.obj).subscribe((result)=>{
    //   //console.log(result);
    // })
console.log(this.obj);

    if (this.obj.planPrice !== null && this.obj.pricePlan !== null) {
      this.payment = true ;
    }

    
  }

  selectPlan(type, duration,priceId=''){
      //console.log(type, duration)
      if (!this.isfreeTrialValid && type==='0') {
        return;
      }
      this.obj = {'planPrice': parseFloat(type),
                   'pricePlan' : duration,
                  'priceId':priceId}
  }
  

  ngOnInit(): void {
    this.subscription.subscriptionDetails.subscribe((currentPlan)=>{
      console.log(moment(new Date()).format("dddd, MMMM Do YYYY"))
      if(currentPlan ){
        const {subscriptionStartDate=new Date(),subscriptionEndDate=new Date(),amount=0,isActive=false,_id,isCancelled,priceId=''} = currentPlan;
        this.currentPlan={
          ...this.currentPlan,
        startDate: moment(subscriptionStartDate).format("dddd, MMMM Do YYYY"),
        endDate:moment(subscriptionEndDate).format("dddd, MMMM Do YYYY"),
        amount,
        priceId,
        isActive,
        _id,
        isCancelled,
      }
      var a = moment(subscriptionEndDate || new Date());
      var b = moment(new Date());
      this.endDays =a.diff(b, 'days');
      this.obj['priceId']=priceId;
      this.obj['planPrice']=amount;
      console.log(this.currentPlan);
      this.subscription.subscriptionActive.next(isActive);
    }


    // this.currentPlan['isCancelled']=false;
    // this.subscription.subscriptionActive.next(true);
    // // this.currentPlan['priceId']='price_1Kj18mJrEVeMChFE8FQtb5bm';
    // this.currentPlan['priceId']='price_1KjO1cJrEVeMChFEiW4aBXDE';
    // this.currentPlan['_id']='62459a11d3316947f88d517e';
    // console.log(this.currentPlan);
      
    })
    this.subscription.subscriptionPlan().subscribe((result) => {
      console.log(result);
      // this.allsubscriptionPlans = result.data.map((el) => {
      //   const {pricePlan, subscriptionStartDate,subscriptionEndDate,amount } = el;
      //   return {
      //     name: el?.name,
      //     amount:amount+ '/month',
      //     subscriptionEndDate,
      //     subscriptionStartDate,
      //     planType:pricePlan || '---' ,
      //     transactionId:el.stripeData?.planId||'---',
      //     paymentMethod:'stripe',
      //   }
      // });
      // this.subscriptionPlans = [...this.allsubscriptionPlans];
    
    })
    this.subscription.subscriptionActive.subscribe((result)=>{
      console.log(result);
      this.isAnyActiveSubscription =result;
      });
    this.subscription.isfreeTrialValid.subscribe((result)=>{
      console.log(result);
      this.isfreeTrialValid =result;
      });
  }


}
