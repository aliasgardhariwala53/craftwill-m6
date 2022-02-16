import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-page-liabilities',
  templateUrl: './success-page-liabilities.component.html',
  styleUrls: ['./success-page-liabilities.component.scss']
})
export class SuccessPageLiabilitiesComponent implements OnInit {
  forwardRouteLink="/liabilities"
  constructor(
    private route :ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(({id,x,y})=>{
  
      if (y==='will') {
         this.forwardRouteLink="/will/createWill";   
        }
      });
   }

}
