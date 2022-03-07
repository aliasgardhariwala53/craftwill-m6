import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-liabilities',
  templateUrl: './create-liabilities.component.html',
  styleUrls: ['./create-liabilities.component.scss']
})
export class CreateLiabilitiesComponent implements OnInit {
routeLink:string="";
toggleModalTutorial: boolean=false;
  constructor(private routeTo:Router) { }
  selectHandler(value){
  this.routeLink=value;
  this.routeTo.navigate([`/liabilities/${this.routeLink}`]);
  // console.log(value);
  
  }
  call(){
    if (this.routeLink==="") {
      return;
    }
    this.routeTo.navigate([`/liabilities/${this.routeLink}`]);
    
  }
  ngOnInit(): void {
  }

}
