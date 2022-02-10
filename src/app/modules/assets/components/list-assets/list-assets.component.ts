import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { countries } from 'src/app/shared/utils/countries-store';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-list-assets',
  templateUrl: './list-assets.component.html',
  styleUrls: ['./list-assets.component.scss'],
})
export class ListAssetsComponent implements OnInit {
  searchForm = new FormControl('');
  toggleModal: boolean;
  toggleModalTutorial: boolean=false;
  assetsData = [];
  assetsFilterData = [];
  assetsSearchData = [];
  showSearch:boolean=false;
  tableHeadings = [
    'Name of the Assets',
    'Unique Number',
    'Country',
    'OwnerShip',
  ];
  allAssetsinOne = [];
  allAssetsData = [];

  tableKeys = ['nameofAssets', 'uniqueNumber', 'country', 'ownerShip'];

  tableData = [];
  classes = [
    'w-10/12 m-0 sm:w-7/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-[12%] break-words capitalize text',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
  ];
  name: string;
  sortType: string;
  title: string = 'Filter Assets';
  lastDate: string;
  assetsType = [
    'Bank Account',
    'Investment Account',
    'Insurance Policy',
    'Business',
    'Real Estate',
    'Motor Vehicle',
    'Intellectual Property',
    'Personal Possession',
    'Safe Deposit Box',
  ];
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];
  constructor(private _userServ: UserService,private spinner: NgxUiLoaderService,private toastr:ToastrService) {}
  public countries:any = countries
  onChangehandler() {
    console.log(this.searchForm.value);
    if (!this.searchForm.value || this.searchForm.value===null ) {
      this.allAssetsinOne = [...this.allAssetsData];
    }
    this.allAssetsinOne = this.allAssetsData.filter((items) => {
      console.log(items.nameofAssets);
      return items.nameofAssets.toLowerCase().includes(this.searchForm.value.toLowerCase());
      
    });
    console.log( this.allAssetsinOne);
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this._userServ.filterAssets(value).subscribe((result) => {
      this.spinner.stop();
      this.assetsFilterData = result.map((items, i) => {
        return {
          nameofAssets: this.getName(items)?.name,
          uniqueNumber: this.getName(items)?.uniqueNumber,
          country: items.country,
          ownerShip: items.specifyOwnershipType,
          type: items.type,
        };
      });
      this.allAssetsinOne = [...this.assetsFilterData];
    },(err)=>{
      this.spinner.stop();
      this.toastr.message("Something Went Wrong!!!",false);
        });
  }

  onClickAction(value) {
    console.log(value);
  }
  getName(item) {
    let data = {
      name: '',
      uniqueNumber: '',
      actionRoute:'',
    };
    switch (item.type) {
      case 'business':
        data.uniqueNumber = item.business.UEN_no || '---';
        data.name = 'Business';
        data.actionRoute = '/assets/business';
        return data;
        break;
      case 'intellectualProperty':
        data.uniqueNumber = item.intellectualProperty.ip_No || '';
        data.name = 'Intellectual Property';
        data.actionRoute = '/assets/intellectualProperty';
        return data;
        break;
      case 'insurancePolicy':
        data.uniqueNumber = item.insurancePolicy.policyNumber || '---';
        data.name = 'Insurance Policy';
        data.actionRoute = '/assets/insurancePolicy';
        return data;
        break;
      case 'bankAccount':
        data.uniqueNumber = item.bankAccount.accountNumber || '---';
        data.name = 'Bank Account';
        data.actionRoute = '/assets/addBank';
        return data;
        break;
      case 'safeDepositBox':
        data.uniqueNumber = item.safeDepositBox.safe_No || '---';
        data.name = 'Safe Deposit Box';
        data.actionRoute = '/assets/safeDeposit';
        return data;
        break;
      case 'realEstate':
        data.uniqueNumber = item.realEstate.accountNumber || '---';
        data.name = 'Real Estate';
        data.actionRoute = '/assets/realEstate';
        return data;
        break;
      case 'personalPossession':
        data.uniqueNumber = item.personalPossession.id_No || '---';
        data.name = 'Personal Possession';
        data.actionRoute = '/assets/personalPossession';
        return data;
        break;
      case 'investmentAccount':
        data.uniqueNumber = item.investmentAccount.accountNo || '---';
        data.name = 'Investment Account';
        data.actionRoute = '/assets/investmentAccount';
        return data;
        break;
      case 'motorVehicle':
        data.uniqueNumber = item.motorVehicle.plateNo || '---';
        data.name = 'Motor Vehicle';
        data.actionRoute = '/assets/moterVehicle';
        return data;
        break;
      default:
        return data;
    }
  }

  onSorting(value) {
    if (value === 'All') {
      this.allAssetsinOne = this.allAssetsData;
    } else {
      this.allAssetsinOne = this.allAssetsData.filter(
        (item) => item.type === value
      );
    }
  }

  ngOnInit(): void {
    this.spinner.start();

    this._userServ.getAssets().subscribe((result) => {
      this.spinner.stop();
      this.allAssetsData = result.data.map((items, i) => {
        return {
          nameofAssets: this.getName(items)?.name,
          uniqueNumber: this.getName(items)?.uniqueNumber,
          country: items.country,
          ownerShip: items.specifyOwnershipType,
          type: items.type,
          _id: items._id,
          actionRoute: this.getName(items)?.actionRoute,
        };
      });
      this.allAssetsinOne = [...this.allAssetsData];
    },(err)=>{
      this.spinner.stop();
        });
  }
}
