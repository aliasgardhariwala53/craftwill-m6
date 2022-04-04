import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { filter, pairwise } from 'rxjs';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { shareItemsHandler } from 'src/app/shared/utils/common-function';
import { countries } from 'src/app/shared/utils/countries-store';
import { nodeModuleNameResolver } from 'typescript';

@Component({
  selector: 'app-bank-account-user',
  templateUrl: './bank-account-user.component.html',
  styleUrls: ['./bank-account-user.component.scss'],
})
export class BankAccountUserComponent implements OnInit {
  Titile: string = 'BankAccount';
  BankAccountUser: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';
  totalShareMessage= false;
  previousRoute: string;
  id: string = '';
  previousUrl: string;
  currentUrl: string;
  fromCreateWill: string;
  memberData = [];
  totalShare=0;
  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  allassetsResidualType = [];
  assetsResidualType = {};
  oneAssetsResidualType = [];
  assetsResidualTypeForm = new FormControl('');
  toggleModalTutorial: boolean;
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private _route: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,
    private _previousRoute: PreviousRouteService,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {
    this._previousRoute.previousRoute.subscribe((route) => {
      this.previousRoute = route;
    });
  }
  public countries: any = countries;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  GiftBenificiary = [];
  shareData = [];
  wid='';
  createForm() {
    this.BankAccountUser = this._fb.group({
      bankname: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$'),Validators.maxLength(32)]],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(20)],
      ],
      country: [, [Validators.required]],
      estimateValue: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.BankAccountUser.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.BankAccountUser,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }

  formErrors = {
    bankname: '',
    accountNumber: '',
    country: '',
    estimateValue: '',
 specifyOwnershipType: '',
  };

  formErrorMessages = {
    bankname: {
      required: 'Bank name is required.',
      pattern: 'Invalid bank Name',
      maxlength: 'Word limit Exceed..',
    },
    accountNumber: {
      required: 'Account number is required.',
      maxlength: 'Please enter valid number',
      
      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is required.',
    },
    estimateValue: {
      required: 'Estimate value is required.',
      maxlength: 'Please enter valid number',
 pattern: 'Only numeric values allowed',
    },
    specifyOwnershipType: {
      required: 'Ownership is required.',
    },
  };
  assetsBeneficiary = [];

  addextras(){
    this.assetsResidualType ={
      assetId:this.id,
      value:this.assetsResidualTypeForm.value,
    }
    const myItem = this.allAssetsBeneficiary?.findIndex(
      (el) => el.assetId === this.id
    );
    const myItemResidual = this.allassetsResidualType?.findIndex(
      (el) => el.assetId === this.id
    );



    if (myItem === -1) {
      this.allAssetsBeneficiary?.push(...this.assetsBeneficiary);
    } else {
      this.allAssetsBeneficiary = this.allAssetsBeneficiary.filter(
        (el) => el.assetId !== this.id
      );
      this.allAssetsBeneficiary = [
        ...this.allAssetsBeneficiary,
        ...this.assetsBeneficiary,
        
      ];
    }
    if (myItemResidual === -1) {
      this.allassetsResidualType?.push(this.assetsResidualType);
    } else {
      this.allassetsResidualType = this.allassetsResidualType?.filter(
        (el) => el.assetId !== this.id
      );
      this.allassetsResidualType = [
        ...this.allassetsResidualType,
        this.assetsResidualType,
        
      ];
    }
    //console.log(this.allAssetsBeneficiary);
    //console.log(this.allassetsResidualType);
    
    this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
    
    this._willServices.assetsResidualType.next(this.allassetsResidualType);
  }
  addBankAccount() {
    //console.log(this.BankAccountUser);

    if (this.BankAccountUser.invalid) {
      this.BankAccountUser.markAllAsTouched();
      this.formErrors = valueChanges(
        this.BankAccountUser,
        { ...this.formErrors },
        this.formErrorMessages
      );
      //console.log('invalid');

      return;
    }

    this.totalShareMessage = false;
    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const bankAccountData = {
      country: this.BankAccountUser.value.country,
      bankAccount: this.BankAccountUser.value,
      type: 'bankAccount',
      specifyOwnershipType: this.BankAccountUser.value.specifyOwnershipType,
      estimateValue: this.BankAccountUser.value.estimateValue,
    };
    this.assetsServices.addAssets(bankAccountData).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success) {
          this.addextras();
          this.BankAccountUser.reset();
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
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  addSharesMember(value) {
    //console.log(value);
    this.assetsBeneficiary = value.map((el) => {
      return { ...el, assetId: this.id };
    });
    //console.log(this.assetsBeneficiary);
  }
  onUpdateBank() {

    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const bankAccountData = {
      specifyOwnershipType: this.BankAccountUser.value.specifyOwnershipType,
      estimateValue: this.BankAccountUser.value.estimateValue,
      country: this.BankAccountUser.value.country,
      bankAccount: this.BankAccountUser.value,
      type: 'bankAccount',
    };
    this.assetsServices.updateAssets(bankAccountData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.addextras();

          this.BankAccountUser.reset();
          if (this.wid !== '') {
            this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{wid:this.wid}});
            return;
          }
          this._route.navigate([this.forwardRouteLink]);
        }
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { bankAccount, country, specifyOwnershipType,estimateValue } = item;
          this.BankAccountUser.patchValue({
            bankname: bankAccount.bankname,
            accountNumber: bankAccount.accountNumber,
            country: country,
            estimateValue: estimateValue,
            specifyOwnershipType: specifyOwnershipType,
          });
          return bankAccount;
        }
        return null;
      });
      // //console.log(data);
    });
  }
  ngOnInit(): void {

    this.createForm();
    this.route.queryParams.subscribe(({ id, x, y ,wid}) => {
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
        // //console.log(this.fromCreateWill);
        this.wid=wid
        //console.log(this.wid);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
if (y === 'myWill') {
        this.backRouteLink = '/will/myWills';
        this.forwardRouteLink = '/will/myWills';
        this.fromCreateWill = y;
        //console.log(this.fromCreateWill);
      }
    });


    this.memberServices.getMembers().subscribe(
      (result) => {
        // //console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          // //console.log(items);
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
        // //console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
      this.assetsBeneficiary = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
      //console.log('slectedResidualMembers', this.slectedResidualMembers);
    });
    this._willServices.assetsResidualType.subscribe((value1) => {
      this.allassetsResidualType = value1;
      this.assetsResidualTypeForm.patchValue(this.allassetsResidualType?.find(
        (el) =>  el.assetId === this.id
      )?.value);
      //console.log(this.assetsResidualTypeForm.value);
      //console.log(value1);
      
    });


  }
}
