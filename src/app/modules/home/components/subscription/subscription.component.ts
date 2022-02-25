import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(private userService : UserService) { }
  
  plandetails : any ;
  obj : any ;

  ngOnInit(): void {
  }

  upgradePlan(){
    this.userService.upgradePlanApi(this.obj).subscribe((result)=>{
      console.log(result);
    })
  }

  selectPlan(type, duration){
      console.log(type, duration)
      this.obj = {'planPrice': type,
                   'pricePlan' : duration}
  }

}
