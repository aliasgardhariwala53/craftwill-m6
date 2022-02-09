import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
  Titile:string='Assets';
  routepath:string="";
  constructor(private routeTo:Router) { }
  selectHandler(value){
    this.routepath=value;
    console.log(value);
    
    console.log(this.routepath);
    }
    call(){
      if (this.routepath==="") {
        return;
      }
      this.routeTo.navigate([`/assets/${this.routepath}`]);
      
    }
  ngOnInit(): void {
  }

}
