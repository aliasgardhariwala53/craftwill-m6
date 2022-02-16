import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { MembersService } from 'src/app/services/members.service';
import { TrustService } from 'src/app/services/trust.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-my-will',
  templateUrl: './my-will.component.html',
  styleUrls: ['./my-will.component.scss']
})
export class MyWillComponent implements OnInit {
  allAssetsData;
  allLiabilitiesData;
  alltrustData = [];
  constructor(
    private liabilitiesServices: LiabilitiesService,
    private assetsServices: AssetsService,
    private trustServices: TrustService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }
  tableHeadingsLiabilities= [
    'Name of the Liabilities',
    'Loan Provider',
    'Loan ID Number',
    'Current Outstanding Amount',
  ];
  tableKeysLiabilities = [
    'loanName',
    'loanProvider',
    'loanNumber',
    'current_Outstanding_Amount',
  ];

  tableDataLiabilities = [];
  classesLiabilities = [
    'w-10/12 m-0 sm:w-7/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-1/12 break-words capitalize text',
    'w-[9%] break-words hidden sm:flex ',
    'w-2/12 break-words hidden sm:flex ',
  ];
  tableHeadingsAssets = [
    'Name of the Assets',
    'Unique Number',
    'Country',
    'OwnerShip',
  ];
  

  tableKeysAssets = ['nameofAssets', 'uniqueNumber', 'country', 'ownerShip'];

  tableDataAssets = [];
  classesAssets = [
    'w-10/12 m-0 sm:w-7/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-[12%] break-words capitalize text',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
  ];
  tableHeadingsTrust = ['Name of the Trust', 'OwnerShip Type'];
  tableKeysTrust = ['trustName', 'ownerShipType'];
  tableDataTrust = [];
  classesTrust = [
    'w-10/12 m-0 sm:w-10/12 break-words capitalize ',
    'w-10/12 m-0 sm:w-[11%] break-words capitalize text  ',
  ];
  onClickAction(value) {
    console.log(value);
  }


  ngOnInit(): void {
    this.spinner.start();

    this.liabilitiesServices.getAllLiabilities().subscribe((result) => {
      this.spinner.stop();
      this.allLiabilitiesData = result.data.map((items, i) => {
        return {
          loanName: this.liabilitiesServices.getLiabilitiesData(items)?.loanName,
          loanProvider: this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
          loanNumber: this.liabilitiesServices.getLiabilitiesData(items)?.loan_Id_Number,
          current_Outstanding_Amount: items.current_Outstanding_Amount,
          type: items.type,
          _id: items._id,
          actionRoute: this.liabilitiesServices.getLiabilitiesData(items)?.actionRoute,
        };
      });
    },(err)=>{
      this.spinner.stop();
      this.toastr.message('Error getting Liabilities Data!!!', false);
        });
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();
      this.allAssetsData = result.data.map((items, i) => {
        return {
          nameofAssets: this.assetsServices.getAssetsData(items)?.name,
          uniqueNumber: this.assetsServices.getAssetsData(items)?.uniqueNumber,
          country: items.country,
          ownerShip: items.specifyOwnershipType,
          type: items.type,
          _id: items._id,
          actionRoute: this.assetsServices.getAssetsData(items)?.actionRoute,
          image: this.assetsServices.getAssetsData(items)?.img,
        };
      });
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
        this.trustServices.getTrust().subscribe((result) => {
          this.spinner.stop();
    
          this.alltrustData = result.data.users.map((items, i) => {
            return {
              trustName: items.trustName,
              ownerShipType: 'sole',
              _id: items._id,
              actionRoute: 'trust/createTrust',
            };
          });
        },(err)=>{
          this.spinner.stop();
          this.toastr.message(errorHandler(err),false);
            });

  }

}
