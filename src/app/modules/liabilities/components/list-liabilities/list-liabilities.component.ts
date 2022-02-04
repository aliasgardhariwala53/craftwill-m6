import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-liabilities',
  templateUrl: './list-liabilities.component.html',
  styleUrls: ['./list-liabilities.component.scss']
})
export class ListLiabilitiesComponent implements OnInit {
liabilitiesData=[];
allLiabilities=[];
  constructor(private _userServ:UserService) { }
  tableHeadings = [
    'Name of the Liabilities',
    'Loan Provider',
    'Loan ID Number',
    'Current Outstanding Amount',

  ];
  tableKeys = ['loanName', 'loanProvider','loanNumber', 'current_Outstanding_Amount'];

  tableData = [
  ];
  classes=[
    "w-10/12 m-0 sm:w-7/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-1/12 break-words capitalize text",
    "w-[9%] break-words hidden sm:flex ",
    "w-2/12 break-words hidden sm:flex ",
    ]
    onClickAction(value){
      console.log(value);
      
    }
  ngOnInit(): void {
    // this._userServ.getSecuredLoan().subscribe((result) => {
    //   console.log(...result.data.users);
      
    //   this.liabilitiesData.push(...result.data.users)
   
    // // });
    // forkJoin([this._userServ.getSecuredLoan(),this._userServ.getUnSecuredLoan(),this._userServ.getPrivateDebt()]).subscribe((result)=>{
    //   // console.log(...result);
    //   let newData = []
    //  result.forEach((item)=>{
       
    //    item.data.users.forEach(element => {
    //      newData.push(element)
    //    });
    //   })
    //   console.log(...newData);
    // this.liabilitiesData.push(...newData);
    // })

     this._userServ.getAllLiabilities().subscribe((result) => {
       console.log(result);
      //  this.liabilitiesData.push(...result.data.users)
       this.liabilitiesData=result.data.map((items,i)=>{
        
        this.allLiabilities.push(...[{loanName:Object.keys(items)[0],loanProvider:Object.values(Object.values(items)[0])[1],loanNumber:items.country,current_Outstanding_Amount:items.specifyOwnershipType}]);
        
        return items;
      })

       
    });
  }

}
