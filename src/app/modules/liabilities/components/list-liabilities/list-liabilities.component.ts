import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime, forkJoin } from 'rxjs';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-list-liabilities',
  templateUrl: './list-liabilities.component.html',
  styleUrls: ['./list-liabilities.component.scss'],
})
export class ListLiabilitiesComponent implements OnInit {
  searchForm = new FormControl(null);
  showSearch: boolean = false;
  toggleModalTutorial: boolean = false;
  LiabilitiesData = [];
  allLiabilities = [];
  LiabilitiesFilterData = [];
  LiabilitiesSearchData = [];
  toggleModal: boolean;
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];
  liabilitiesType = ['Secured Loan', 'Unsecured Loan', 'Private Dept'];
  constructor(
    private liabilitiesServices: LiabilitiesService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}
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
    this.allLiabilities = this.LiabilitiesData.map((items) => {
      for (const property in items) {
        console.log(items[property]);
        if(items[property].toString().toLowerCase().includes(this.searchForm.value.toLowerCase())){
          return items
        }
      }
    }).filter(items => items!== undefined);
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this.liabilitiesServices.filterLiabilities(value).subscribe(
      (result) => {
        this.spinner.stop();
        this.LiabilitiesFilterData = result.map((items, i) => {
          return {
            loanName:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanName,
            loanProvider:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
            loanNumber:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
            current_Outstanding_Amount: items.current_Outstanding_Amount,
            type: items.type,
          };
        });
        this.allLiabilities = [...this.LiabilitiesFilterData];
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
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

  ngOnInit(): void {
    this.spinner.start();
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      console.log(e);
      this.onChangehandler();
    });
    this.liabilitiesServices.getAllLiabilities().subscribe(
      (result) => {
        this.spinner.stop();
        this.LiabilitiesData = result.data.map((items, i) => {
          return {
            loanName:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanName,
            loanProvider:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
            loanNumber:
              this.liabilitiesServices.getLiabilitiesData(items)
                ?.loan_Id_Number,
            current_Outstanding_Amount: items.current_Outstanding_Amount,
            type: items.type,
            _id: items._id,
            actionRoute:
              this.liabilitiesServices.getLiabilitiesData(items)?.actionRoute,
          };
        });
        this.allLiabilities = [...this.LiabilitiesData];
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error getting Liabilities Data!!!', false);
      }
    );
  }
}
