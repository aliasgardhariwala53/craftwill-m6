import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-page-assets',
  templateUrl: './success-page-assets.component.html',
  styleUrls: ['./success-page-assets.component.scss']
})
export class SuccessPageAssetsComponent implements OnInit {
  forwardRouteLink="/assets";
  wid='';
  fromCreateWill: string;
  constructor(
    private route :ActivatedRoute,
    private _route: Router,
  ) { }
  onSuccess(){
    if (this.fromCreateWill==='will') {
      if (this.wid !== '') {
        this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{wid:this.wid}});
        return;
      }
      return;
    }
    this._route.navigate([`${this.forwardRouteLink}`]);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({y,wid})=>{
  
     if (y==='will') {
        this.forwardRouteLink="/will/createWill";   
        this.wid=wid
        this.fromCreateWill
        //console.log(this.wid); 
      }
     if (y==='secure') {
        this.forwardRouteLink="/liabilities/securedLoan";   
       }
     });
  }

}
