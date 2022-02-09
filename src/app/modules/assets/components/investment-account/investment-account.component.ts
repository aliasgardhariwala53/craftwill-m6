import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-investment-account',
  templateUrl: './investment-account.component.html',
  styleUrls: ['./investment-account.component.scss'],
})
export class InvestmentAccountComponent implements OnInit {
  id: string = '';
  InvestmentAccountUser: FormGroup;
  responseMessage: string;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
  ) {}
  public countries: any = countries;
  createForm() {
    this.InvestmentAccountUser = this._fb.group({
      accountName: ['', [Validators.required]],
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
    this._userServ.addAssets(InvestmentData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.InvestmentAccountUser.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  onUpdateInvestment(){
    this.spinner.start();
    const InvestmentData = {
      country: this.InvestmentAccountUser.value.country,
      specifyOwnershipType:
        this.InvestmentAccountUser.value.specifyOwnershipType,
      investmentAccount: this.InvestmentAccountUser.value,
      type: 'investmentAccount',
    };
    this._userServ.updateAssets(InvestmentData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.InvestmentAccountUser.reset();
        this._route.navigate(['/assets']);
      }
     
      this.toastr.message(result.message, result.success);
    });
  }
  getdata(id){
    this._userServ.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);
      
      const data=result.data.filter((item,i)=>{
        if (item._id===id) {
          const {investmentAccount,country,specifyOwnershipType} = item;
          this.InvestmentAccountUser.patchValue({
            accountName: investmentAccount.accountName,
            accountNo:investmentAccount.accountNo,
            country,
            specifyOwnershipType
          })     
          return investmentAccount;
        }
        return null;
      })
      console.log(data);
      

     
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({id})=>{
      if (id) {
        this.id=id;
        this.getdata(id);
      }
    })
    this.createForm();
  }
}
