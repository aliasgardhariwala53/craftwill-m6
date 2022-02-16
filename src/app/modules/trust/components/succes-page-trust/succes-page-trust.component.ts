import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-succes-page-trust',
  templateUrl: './succes-page-trust.component.html',
  styleUrls: ['./succes-page-trust.component.scss']
})
export class SuccesPageTrustComponent implements OnInit {
  forwardRouteLink="/trust"
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
