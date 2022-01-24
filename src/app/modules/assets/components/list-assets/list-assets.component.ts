import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-assets',
  templateUrl: './list-assets.component.html',
  styleUrls: ['./list-assets.component.scss']
})
export class ListAssetsComponent implements OnInit {
  
  

assetsData=[];
  tableHeadings = [
    'Name of the Assets',
    'Unique Number',
    'Country',
    'OwnerShip',
  ];
  tableKeys = ['fullname', 'Relationship', 'gender', 'id_type', 'id_number'];
  tableData = [
  ];
   classes=[
    "w-10/12 m-0 sm:w-7/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-[12%] break-words capitalize text",
    "w-1/12 break-words hidden sm:block ",
    "w-1/12 break-words hidden sm:block ",

    ]
  constructor(private _userServ:UserService) { }
  onClickAction(value){
    console.log(value);
    
  }
  ngOnInit(): void {
    this._userServ.getAssetsDetails().subscribe((result) => {
      console.log(result);
      
      // this.assetsData = result.data.map((item) => {
      //   return item;
      // });
    });
  }

}
