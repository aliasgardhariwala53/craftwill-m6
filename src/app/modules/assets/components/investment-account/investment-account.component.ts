import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-investment-account',
  templateUrl: './investment-account.component.html',
  styleUrls: ['./investment-account.component.scss'],
})
export class InvestmentAccountComponent implements OnInit {
  id: string = '';
  fromCreateWill: string;
  assetsResidualType;
  InvestmentAccountUser: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';

  toggleModalTutorial: boolean;
  memberData = [];
  allAssetsBeneficiary = [];
  assetsBeneficiary = [];
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {}
  public countries: any = countries;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  slectedResidualMembers = [];
  GiftBenificiary = [];
  shareData = [];
  createForm() {
    this.InvestmentAccountUser = this._fb.group({
      accountName: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      accountNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.InvestmentAccountUser.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.InvestmentAccountUser,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    accountName: '',
    accountNo: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    accountName: {
      required: 'Account Name  is Required',
      pattern: 'Please Enter Valid Name',
    },
    accountNo: {
      required: 'Account No  is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addinvestmentAccount() {
    console.log(this.InvestmentAccountUser);

    if (this.InvestmentAccountUser.invalid) {
      this.InvestmentAccountUser.markAllAsTouched();
      this.formErrors = valueChanges(
        this.InvestmentAccountUser,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const InvestmentData = {
      country: this.InvestmentAccountUser.value.country,
      specifyOwnershipType:
        this.InvestmentAccountUser.value.specifyOwnershipType,
      investmentAccount: this.InvestmentAccountUser.value,
      type: 'investmentAccount',
    };
    this.assetsServices.addAssets(InvestmentData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.InvestmentAccountUser.reset();
          if (this.fromCreateWill === 'will') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'will' },
            });
          } else if (this.fromCreateWill === 'secure') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'secure' },
            });
          } else {
            this._route.navigate(['/assets/assetsuccess']);
          }
        }
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  onUpdateInvestment() {
    this.spinner.start();
    const InvestmentData = {
      country: this.InvestmentAccountUser.value.country,
      specifyOwnershipType:
        this.InvestmentAccountUser.value.specifyOwnershipType,
      investmentAccount: this.InvestmentAccountUser.value,
      type: 'investmentAccount',
    };
    this.assetsServices.updateAssets(InvestmentData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem = this.allAssetsBeneficiary.findIndex(
            (el) => el.assetId===this.id
          );
          if (myItem === -1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary = this.allAssetsBeneficiary.filter(
              (el) => el.assetId!==this.id
            );
            this.allAssetsBeneficiary = [
              ...this.allAssetsBeneficiary,
              ...this.assetsBeneficiary,
            ];
          }
          console.log(this.allAssetsBeneficiary);

       if (this.fromCreateWill==='will') {         
            this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          }
          this.InvestmentAccountUser.reset();

          this._route.navigate([this.forwardRouteLink]);
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        console.log(result);

        const data = result.data.filter((item, i) => {
          if (item._id === id) {
            const { investmentAccount, country, specifyOwnershipType } = item;
            this.InvestmentAccountUser.patchValue({
              accountName: investmentAccount.accountName,
              accountNo: investmentAccount.accountNo,
              country,
              specifyOwnershipType,
            });
            return investmentAccount;
          }
          return null;
        });
        console.log(data);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  addSharesMember(value) {
    console.log(value);  
    this.assetsBeneficiary= value.map((el)=>{return{...el,assetId:this.id}})
    console.log(this.assetsBeneficiary);
  }
  ngOnInit(): void {
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary=value;
      console.log("assetsBeneficiary",value);
      this.slectedResidualMembers=this.allAssetsBeneficiary?.filter((el)=>el.assetId===this.id);
   
    });
    this.route.queryParams.subscribe(({ id, x, y }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink = '/will/createWill';
          this.forwardRouteLink = '/will/createWill';
        }
      }
      if (y === 'will') {
        this.backRouteLink = '/will/createWill';
        this.forwardRouteLink = '/will/createWill';
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
    });
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship:
              this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this.createForm();
  }
}
