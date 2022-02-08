import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-bank-account-user',
  templateUrl: './bank-account-user.component.html',
  styleUrls: ['./bank-account-user.component.scss'],
})
export class BankAccountUserComponent implements OnInit {
  Titile: string = 'BankAccount';
  BankAccountUser: FormGroup;
  responseMessage: string;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private _route: Router
    ,private toastr: ToastrService,
    private spinner:NgxUiLoaderService,
  ) {}

  createForm() {
    this.BankAccountUser = this._fb.group({
      bankname: ['', [Validators.required]],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      country: ['', [Validators.required]],
      estimateValue: ['', [Validators.required]],
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
      type:'bankAccount'
    };
    this._userServ.addAssets(bankAccountData).subscribe((result) => {
      this.spinner.stop();
      this.toastr.message(result.message,result.success);
      if (result.success) {
        this.BankAccountUser.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }

      
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
}
