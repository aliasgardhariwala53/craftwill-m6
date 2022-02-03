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
  allAssetsinOne=[];

  tableKeys = ['nameofAssets', 'uniqueNumber', 'country','ownerShip'];

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
    this._userServ.getAssets().subscribe((result) => {
     

      this.assetsData=result.data.map((items,i)=>{
        
        this.allAssetsinOne.push(...[{nameofAssets:Object.keys(items)[0],uniqueNumber:Object.values(Object.values(items)[0])[1],country:items.country,ownerShip:items.specifyOwnershipType}]);
        
        return items;
      })
    });
  }

}
