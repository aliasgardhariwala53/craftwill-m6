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
  tableKeys = ['Type','fullname', 'country', 'specifyOwnershipType', 'id_type', 'id_number'];
  tableData = [
  ];
   classes=[
    "w-10/12 m-0 sm:w-7/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-[12%] break-words capitalize text",
    "w-1/12 break-words hidden md:flex ",
    "w-1/12 break-words hidden md:flex ",

    ]
  constructor(private _userServ:UserService) { }
  onClickAction(value){
    console.log(value);
    
  }
  ngOnInit(): void {
    this._userServ.getAssetsDetails().subscribe((result) => {
      let allAssetsData=[];
      result.forEach(element => {
        allAssetsData.push(...element);
      });
      console.log(...allAssetsData);
      
      this.assetsData.push(...allAssetsData);

    });
  }

}
