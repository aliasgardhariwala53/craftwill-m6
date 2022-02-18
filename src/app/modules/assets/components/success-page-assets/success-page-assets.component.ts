import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-page-assets',
  templateUrl: './success-page-assets.component.html',
  styleUrls: ['./success-page-assets.component.scss']
})
export class SuccessPageAssetsComponent implements OnInit {
  forwardRouteLink="/assets"
  constructor(
    private route :ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(({y})=>{
  
     if (y==='will') {
        this.forwardRouteLink="/will/createWill";   
       }
     if (y==='secure') {
        this.forwardRouteLink="/liabilities/securedLoan";   
       }
     });
  }

}
