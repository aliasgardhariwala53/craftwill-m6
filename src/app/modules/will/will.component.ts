import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-will',
  templateUrl: './will.component.html',
  styleUrls: ['./will.component.scss']
})
export class WillComponent implements OnInit {

  constructor( public _subscription: SubscriptionService,private _route :Router,private activeRoute :ActivatedRoute) { }

  ngOnInit(): void {
  //   this._subscription.subscriptionActive.subscribe(active=>{
  //   if (!active) {
  //   this._route.navigate(['/home/subscription']);
  //   return;
  //  }
    
  //   })
  }

}
