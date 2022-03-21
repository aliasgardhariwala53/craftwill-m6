import { Component, OnInit } from '@angular/core';
import { duration } from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(private userService : UserService) { }
  
  plandetails : any ;
  obj = {
    planPrice: null,
    pricePlan: null
  };

  ngOnInit(): void {
  }

  payment = false ;
  upgradePlan(){
    // this.userService.upgradePlanApi(this.obj).subscribe((result)=>{
    //   console.log(result);


    // })

    if (this.obj.planPrice !== null && this.obj.pricePlan !== null) {
      this.payment = true ;
    }
  }

  selectPlan(type, duration){
      console.log(type, duration)
      this.obj = {'planPrice': parseFloat(type),
                   'pricePlan' : duration}
  }

}
