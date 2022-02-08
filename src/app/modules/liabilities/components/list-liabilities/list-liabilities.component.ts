import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-liabilities',
  templateUrl: './list-liabilities.component.html',
  styleUrls: ['./list-liabilities.component.scss'],
})
export class ListLiabilitiesComponent implements OnInit {
  searchForm = new FormControl(null);
  showSearch:boolean=false;
  toggleModalTutorial:boolean=false;
  LiabilitiesData = [];
  allLiabilities = [

  ];
  LiabilitiesFilterData = [];
  LiabilitiesSearchData = [];
  toggleModal: boolean;
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];
  liabilitiesType = ['Secured Loan', 'Unsecured Loan', 'Private Dept'];
  constructor(private _userServ: UserService,private spinner:NgxUiLoaderService) {}
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
  onChangehandler() {
    if (!this.searchForm.value) {
      console.log(this.searchForm.value);
      this.allLiabilities = [...this.LiabilitiesData];
    }
    this.allLiabilities = this.LiabilitiesData.filter((items) => {
      return items.loanName.toLowerCase().includes(this.searchForm.value.toLowerCase());
    });
   
    
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this._userServ.filterLiabilities(value).subscribe((result) => {
      this.spinner.stop();
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
  onSorting(value) {
    if (value === 'All') {
      this.allLiabilities = this.LiabilitiesData;
    } else {
      this.allLiabilities = this.LiabilitiesData.filter(
        (item) => item.type === value
      );
    }
  }

  getName(item) {
    let data = {
      loanName: '',
      loanProvider: '',
      loan_Id_Number: '',
    };
    switch (item.type) {
      case 'privateDept':
        data.loanProvider = item.privateDept.dept_Name || '---';
        data.loan_Id_Number = item.privateDept.loan_Id_Number || '---';
        data.loanName = 'Private Dept';
        return data;
        break;
      case 'securedLoan':
        data.loanProvider = item.securedLoan.loanProvider || '';
        data.loan_Id_Number = item.securedLoan.loan_Id_Number || '';
        data.loanName = 'Secured Loan';
        return data;
        break;
      case 'unsecuredLoan':
        data.loanProvider = item.unsecuredLoan.loanProvider || '---';
        data.loan_Id_Number = item.unsecuredLoan.loan_Id_Number || '---';
        data.loanName = 'Unsecured Loan';
        return data;
        break;

      default:
        return data;
    }
  }
  ngOnInit(): void {
    this.spinner.start();
    this._userServ.getAllLiabilities().subscribe((result) => {
      this.spinner.stop();
      this.LiabilitiesData = result.data.map((items, i) => {
        return {
          loanName: this.getName(items)?.loanName,
          loanProvider: this.getName(items)?.loanProvider,
          loanNumber: this.getName(items)?.loanProvider,
          current_Outstanding_Amount: items.current_Outstanding_Amount,
          type: items.type,
          _id: items._id,
        };
      });
      this.allLiabilities = [...this.LiabilitiesData];
    });
  }
}
