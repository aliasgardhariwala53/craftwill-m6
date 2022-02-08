import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment.prod';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
username : string ="helloo";
imageSrc: string = '';
toggleModal : boolean =false;
  constructor(public router:Router,public _headerServ:HeaderService, private _userServ: UserService) {
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
    this._headerServ.image.subscribe((image)=>{
     this.imageSrc=image;
    })
    this._userServ.getProfile().subscribe((result) => {
      this.username=result.data.fullName;
     
    });

    this._userServ.getUserImage().subscribe((img) => {
   
      this.imageSrc = `${environment.serverUrl}${img.profileImage}`;

    });

  }

}
