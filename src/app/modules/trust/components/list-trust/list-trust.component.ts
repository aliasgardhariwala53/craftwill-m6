import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  constructor(private _userServ: UserService) {}
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
    console.log('helllooo', value);
    this._userServ.filterTrust(value).subscribe((result) => {
      console.log(result);
      this.trustFilterData = result.map((items, i) => {
        return {
          trustName: items.trustName,
          ownerShipType: 'sole',
        };
      });
      this.alltrustData = [...this.trustFilterData];
    });
  }
  ngOnInit(): void {
    this._userServ.getTrust().subscribe((result) => {
      console.log(...result.data.users);
      this.trustData.push(...result.data.users);

      this.trustData = result.data.map((items, i) => {
        return {
          trustName: items.trustName,
          ownerShipType: 'sole',
        };
      });
      this.alltrustData = [...this.trustData];
    });
  }
}
