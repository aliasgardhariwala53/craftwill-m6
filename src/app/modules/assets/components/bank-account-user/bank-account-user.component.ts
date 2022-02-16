import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-bank-account-user',
  templateUrl: './bank-account-user.component.html',
  styleUrls: ['./bank-account-user.component.scss'],
})
export class BankAccountUserComponent implements OnInit {
  Titile: string = 'BankAccount';
  BankAccountUser: FormGroup;
  responseMessage: string;
backRouteLink="/assets/createAssets";
forwardRouteLink="/assets"


      
  previousRoute: string;
  id: string = '';
  previousUrl: string;
  currentUrl: string;
  fromCreateWill: string;
  memberData = [];
  slectedResidualMembers = [];
  assetsResidualType:string;
  toggleModalTutorial:boolean;
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private _route: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,
    private _previousRoute: PreviousRouteService,
    private memberServices: MembersService
  ) {
    this._previousRoute.previousRoute.subscribe((route) => {
      this.previousRoute = route;
    });
  }
  public countries: any = countries;
key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  createForm() {
    this.BankAccountUser = this._fb.group({
      bankname: ['', [Validators.required]],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      country: [, [Validators.required]],
      estimateValue: ['', [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
      GiftBenificiary: [{member:String,share:Number}],
      ifBenificiaryNotSurvive : [{member:String,share:Number}],
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
      required: 'Bank Name is Required',
    },
    accountNumber: {
      required: 'Account Number is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },
    estimateValue: {
      required: 'Estimate Value is Required',
    },
    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addBankAccount() {
    console.log(this.BankAccountUser);

    if (this.BankAccountUser.invalid) {
      this.BankAccountUser.markAllAsTouched();
      this.formErrors = valueChanges(
        this.BankAccountUser,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const bankAccountData = {
      country: this.BankAccountUser.value.country,
      bankAccount: this.BankAccountUser.value,
      type: 'bankAccount',
      specifyOwnershipType: this.BankAccountUser.value.specifyOwnershipType,
    };
    this.assetsServices.addAssets(bankAccountData).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success) {
          this.BankAccountUser.reset();
          this._route.navigate(['/assets/assetsuccess'],{queryParams:{y:'will'}});
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  arr = [
    {
      member: '',
      value: 10,
    },
  ];
  addSharesMember(value) {
    let sharesMemberId: Array<any> = this.BankAccountUser.value.GiftBenificiary;
    // let arr1=[{
    //   member:'',
    //   share:0
    // }]
    let arr1;
    if (sharesMemberId?.find(el => {
      if (el?.member === value) {
        
        return true;
      }
      return false;
    })) {
    arr1= sharesMemberId.filter((el)=>el.member!==value);
    }else{
    arr1.push({member:value,share:0})
    }
    console.log(arr1);
    sharesMemberId?.push(...arr1);
    console.log(this.BankAccountUser.value.residualMemberId);
  }
  onUpdateBank() {
    this.spinner.start();
    const bankAccountData = {
      specifyOwnershipType: this.BankAccountUser.value.specifyOwnershipType,
      country: this.BankAccountUser.value.country,
      bankAccount: this.BankAccountUser.value,
      type: 'bankAccount',
      GiftBenificiary: this.BankAccountUser.value.GiftBenificiary,
    };
    this.assetsServices.updateAssets(bankAccountData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.BankAccountUser.reset();
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
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { bankAccount, country, specifyOwnershipType } = item;
          this.BankAccountUser.patchValue({
            bankname: bankAccount.bankname,
            accountNumber: bankAccount.accountNumber,
            country: country,
            estimateValue: bankAccount.estimateValue,
            specifyOwnershipType: specifyOwnershipType,
          });
          return bankAccount;
        }
        return null;
      });
      console.log(data);

      let obj = [
        {
          name: 'krishna',
          value: 50,
        },
        {
          name: 'krishna',
          value: 50,
        },
      ];
    });
  }
  ngOnInit(): void {
    this.createForm();

    this.route.queryParams.subscribe(({ id, x,y }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
    this.backRouteLink="/will/createWill";      this.fromCreateWill = x;
        }
      }
if (y==='will') {
        this.backRouteLink="/will/createWill"; 
  this.forwardRouteLink="/will/createWill";   
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
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
  }
}
