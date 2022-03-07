import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
  Titile:string='Assets';
  routepath:string="";
  backRouteLink="/assets"
  fromCreateWill:string;
  toggleModalTutorial: boolean=false;
  constructor(private routeTo:Router,
    private route: ActivatedRoute) { }
  selectHandler(value){
    this.routepath=value;
    console.log(value);
    
    console.log(this.routepath);
  this.call();
    }
    call(){
      if (this.routepath==="") {
        return;
      }
      if (this.fromCreateWill==='will') {
        this.routeTo.navigate([`/assets/${this.routepath}`],{queryParams:{y:'will'}});
      } else if(this.fromCreateWill==='secure'){
        this.routeTo.navigate([`/assets/${this.routepath}`],{queryParams:{y:'secure'}});
      }
      else {
        
        this.routeTo.navigate([`/assets/${this.routepath}`]);
      }
      
    }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ id, x,y }) => {

if (y==='will') {
        this.backRouteLink="/will/createWill"; 
        this.fromCreateWill = y;  
      }
if (y==='secure') {
        this.backRouteLink="/liabilities/securedLoan"; 
        this.fromCreateWill = y;  
      }

    });
  }

}
