import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-liabilities',
  templateUrl: './list-liabilities.component.html',
  styleUrls: ['./list-liabilities.component.scss'],
})
export class ListLiabilitiesComponent implements OnInit {
  searchForm = new FormControl(null);

  LiabilitiesData = [];
  allLiabilities = [
    {
      loanName: 'ali asgar',
      loanProvider:'loanProvider',
      loanNumber: 'loanProvider',
      current_Outstanding_Amount: 'current_Outstanding_Amount',
      type: 'type',
    }
  ];
  LiabilitiesFilterData = [];
  LiabilitiesSearchData = [];
  toggleModal: boolean;
  ownershipFilter=['Sole','joint'];
  countryFilter=['in','en'];
  liabilitiesType = [
    'Secured Loan',
    'Unsecured Loan',
    'Private Dept',
 ];
  constructor(private _userServ: UserService) {}
  tableHeadings = [
    'Name of the Liabilities',
    'Loan Provider',
    'Loan ID Number',
    'Current Outstanding Amount',
  ];
  tableKeys = [
    'loanName',
    'loanProvider',
    'loanNumber',
    'current_Outstanding_Amount',
  ];

  tableData = [];
  classes = [
    'w-10/12 m-0 sm:w-7/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-1/12 break-words capitalize text',
    'w-[9%] break-words hidden sm:flex ',
    'w-2/12 break-words hidden sm:flex ',
  ];
  onClickAction(value) {
    console.log(value);
  }
  onChangehandler(value){
  console.log(value);
  console.log(this.searchForm.value,);
  this.LiabilitiesSearchData=this.allLiabilities.map((items)=>{
  
  if (items.loanName.includes(this.searchForm.value)) {
    return items;
  }else{
    return null;
  }
  return [];
})
this.allLiabilities = [...this.LiabilitiesSearchData];
  }
  onFilterHandler(value) {
    console.log('helllooo', value);
    this._userServ.filterLiabilities(value).subscribe((result) => {
      console.log(result);
      this.LiabilitiesFilterData = result.map((items, i) => {
        return {
          loanName: this.getName(items)?.loanName,
          loanProvider: this.getName(items)?.loanProvider,
          loanNumber: this.getName(items)?.loanProvider,
          current_Outstanding_Amount: items.current_Outstanding_Amount,
          type: items.type,
        };
      });
      this.allLiabilities = [...this.LiabilitiesFilterData];
    });
  }
  onSorting(value){

    if (value==='All') {
      
      this.allLiabilities=this.LiabilitiesData;
    }
     else {
      
      this.allLiabilities=this.LiabilitiesData.filter((item)=>item.type===value);
    }
      }
    
  getName(item){
   
    let data={
      loanName:'',
      loanProvider:'',
      loan_Id_Number:''
    }
    switch (item.type) {
      case 'privateDept':
        data.loanProvider=item.privateDept.dept_Name || '---';
        data.loan_Id_Number=item.privateDept.loan_Id_Number || '---';
        data.loanName='Private Dept';
        return data;
        break;
      case 'securedLoan':
        data.loanProvider=item.securedLoan.loanProvider || '';
        data.loan_Id_Number=item.securedLoan.loan_Id_Number || '';
        data.loanName='Secured Loan';
        return data;
        break;
      case 'unsecuredLoan':
        data.loanProvider=item.unsecuredLoan.loanProvider  || '---';
        data.loan_Id_Number=item.unsecuredLoan.loan_Id_Number  || '---';
        data.loanName='Unsecured Loan';
        return data;
        break;
     
      default:
 return data;
      }
  }
  ngOnInit(): void {


    this._userServ.getAllLiabilities().subscribe((result) => {


      this.LiabilitiesData = result.data.map((items, i) => {
        return {
          loanName: this.getName(items)?.loanName,
          loanProvider: this.getName(items)?.loanProvider,
          loanNumber: this.getName(items)?.loanProvider,
          current_Outstanding_Amount: items.current_Outstanding_Amount,
          type: items.type,
        };
      });
      this.allLiabilities = [...this.LiabilitiesData];

   
    });
  }
}
