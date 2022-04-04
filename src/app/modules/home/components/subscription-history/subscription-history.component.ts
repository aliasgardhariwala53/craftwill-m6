import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription-history',
  templateUrl: './subscription-history.component.html',
  styleUrls: ['./subscription-history.component.scss']
})
export class SubscriptionHistoryComponent implements OnInit {
  searchForm = new FormControl('');
  showSearch: boolean = false;
  subscriptionData = [];
  allSubscriptionData = [];
  constructor(private subscription: SubscriptionService,) { }
  tableHeadings = [
    'Personal Details',
    'Amount',
    'Subscription Start date',
    'Subscription Expiry date',
    'Plan Type',
    'Transaction ID',
    'Payment Method',

  ];
  tableKeys = ['name',
   'amount',
  'subscriptionStartDate',
  'subscriptionEndDate',
  'planType',
  'transactionId',
  'paymentMethod'];
  classes = [
    "w-10/12 m-0 sm:w-3/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-1/12 break-words capitalize text",
    "w-10/12 m-0 sm:w-2/12 break-words hidden md:flex",
    "w-10/12 m-0 sm:w-2/12 break-words hidden md:flex",
    "w-10/12 m-0 sm:w-1/12 break-words hidden md:flex",
    "w-10/12 m-0 sm:w-1/12 break-words hidden md:flex",
    "w-10/12 m-0 sm:w-1/12 break-words hidden md:flex",
  ]

  onClickAction(value) {
    //console.log(value);

  }
  deleteItemHandler(item) { }
  focusMethod() {
    this.showSearch = !this.showSearch;
    setTimeout(() => {
      document.getElementById("mySearchField").focus();
    }, 0);
  }
  onsearchHandler() {
    //console.log(this.searchForm.value);
    if (!this.searchForm.value || this.searchForm.value === null) {
      this.subscriptionData = [...this.allSubscriptionData];
    }

    this.subscriptionData = this.allSubscriptionData.map((items) => {
      //console.log(items);
      
      for (const property in items) {
        //console.log(items[property]);
        if(items[property]?.toString().toLowerCase().includes(this.searchForm.value.toLowerCase())){
          return items
        }
      }
    }).filter(items => items!== undefined);
    //console.log(this.subscriptionData);
  }
  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      //console.log(e);
      this.onsearchHandler();
    });
    this.subscription.subscriptionHistory().subscribe((result) => {
      //console.log(result);
      this.allSubscriptionData = result.data.map((el) => {
        const {pricePlan, subscriptionStartDate,subscriptionEndDate,amount } = el;
        return {
          name: el?.name,
          amount:amount+ '/month',
          subscriptionEndDate,
          subscriptionStartDate,
          planType:pricePlan || '---' ,
          transactionId:el.stripeData?.planId||'---',
          paymentMethod:'stripe',
        }
      });
      this.subscriptionData = [...this.allSubscriptionData];
      // this.subscription.subscriptionActive.next(true);
      // this.subscription.subscriptionDetails.next({
      //   amount: 17.99,
      //   features: [],
      //   isActive: false,
      //   isCancelled: false,
      //   priceId: "price_1KjO1cJrEVeMChFEiW4aBXDE",
      //   subscriptionEndDate: "2022-05-01",
      //   subscriptionStartDate: "2022-04-01",
      //   _id:'6246a8a9ce30871509bf7a87',
      // });
    })
  }

}
