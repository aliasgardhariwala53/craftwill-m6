import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-liabilities',
  templateUrl: './create-liabilities.component.html',
  styleUrls: ['./create-liabilities.component.scss']
})
export class CreateLiabilitiesComponent implements OnInit {
routeLink:string="";
wid='';
backRouteLink="/liabilities"
toggleModalTutorial: boolean=false;
fromCreateWill:string;
  constructor(private routeTo:Router,private route: ActivatedRoute) { }
  selectHandler(value){
  this.routeLink=value;
  // console.log(value);
  this.call()
  }
  call(){
    if (this.routeLink==="") {
      return;
    }
    if (this.fromCreateWill==='will') {
      if (this.wid !== '') {
        this.routeTo.navigate([`/liabilities/${this.routeLink}`], { queryParams:{y:'will',wid:this.wid}});
        return;
      }
      this.routeTo.navigate([`/liabilities/${this.routeLink}`],{queryParams:{y:'will'}});
    } 
    else {
      
      this.routeTo.navigate([`/liabilities/${this.routeLink}`]);
    }
    
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ id, x,y ,wid}) => {

      if (y==='will') {
              this.backRouteLink="/will/createWill"; 
              this.fromCreateWill = y;  
              this.wid=wid;
            }
     
      
          });
  }

}
