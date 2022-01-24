import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
username : string ="helloo";
  constructor(public router:Router,public _headerServ:HeaderService) {
    this._headerServ.username.subscribe((name)=>{
      this.username=name;
    })
   }
   key=['willType','date']
  logout(){
    localStorage.removeItem("user")
  }
  latestWill(){
console.log('latest Will');

  }
  ngOnInit(): void {
  }

}
