import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-trust',
  templateUrl: './list-trust.component.html',
  styleUrls: ['./list-trust.component.scss']
})
export class ListTrustComponent implements OnInit {
  trustData=[];
  tableHeadings = [
    'Name of the Trust',
    'Type Of Trust',
    'OwnerShip Type',
  ];
  tableKeys = ['trustName', 'Relationship', 'gender'];
  tableData = [
  ];
   classes=[
    "w-10/12 m-0 sm:w-8/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-[11%] break-words capitalize text hidden sm:block ",
    "w-[10%] break-words hidden sm:block ",

  
    ]
  constructor(private _userServ:UserService) { }
  onClickAction(value){
    console.log(value);
    
  }
  ngOnInit(): void {
    this._userServ.getTrust().subscribe((result) => {
      console.log(...result.data.users);   
      this.trustData.push(...result.data.users);
    });
  }

}
