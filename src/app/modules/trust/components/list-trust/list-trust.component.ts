import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-trust',
  templateUrl: './list-trust.component.html',
  styleUrls: ['./list-trust.component.scss'],
})
export class ListTrustComponent implements OnInit {
  searchForm = new FormControl(null);
  trustType = ['Type 1', 'Type 2'];

  showSearch: boolean=false;
  toggleModalTutorial: boolean=false;
  toggleModal: boolean;
  trustData = [];
  alltrustData = [];
  trustFilterData = [];
  trustSearchData = [];
  tableHeadings = ['Name of the Trust', 'OwnerShip Type'];
  tableKeys = ['trustName', 'ownerShipType'];
  tableData = [];
  classes = [
    'w-10/12 m-0 sm:w-10/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-[11%] break-words capitalize text  ',
  ];
  constructor(private _userServ: UserService,private spinner:NgxUiLoaderService) {}
  onClickAction(value) {
    console.log(value);
  }
  onChangehandler() {
    console.log(this.searchForm.value);
    if (!this.searchForm.value) {
      this.alltrustData = [...this.trustData];
    }
    this.alltrustData = this.alltrustData.filter((items) => {
      return items.trustName
        .toLowerCase()
        .includes(this.searchForm.value.toLowerCase());
    });
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this._userServ.filterTrust(value).subscribe((result) => {
      this.spinner.stop();
      console.log('sdasdasdadas', result);
      this.alltrustData = result.map((items, i) => {
        return {
          trustName: items.trustName,
          ownerShipType: 'sole',
        };
      });
    });
  }
  ngOnInit(): void {
    this.spinner.start();
    this._userServ.getTrust().subscribe((result) => {
      this.spinner.stop();

      this.trustData = result.data.users.map((items, i) => {
        return {
          trustName: items.trustName,
          ownerShipType: 'sole',
        };
      });
      this.alltrustData = [...this.trustData];
    });
  }
}
