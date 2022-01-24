import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bank-account-user',
  templateUrl: './bank-account-user.component.html',
  styleUrls: ['./bank-account-user.component.scss']
})
export class BankAccountUserComponent implements OnInit {
  Titile:string="BankAccount"
  BankAccountUser:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }

  createForm(){
 this.BankAccountUser= this._fb.group({
  bankname  : ["",[Validators.required]],
  accountNumber  : ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
  country  : ["",[Validators.required]],
  estimateValue  : ["",[Validators.required]],
  specifyOwnershipType   : ["",[Validators.required]],
 })
 this.BankAccountUser.valueChanges.subscribe(() => {
  this.formErrors = valueChanges(
    this.BankAccountUser,
    { ...this.formErrors },
    this.formErrorMessages
  );
});
  }
formErrors = {

  bankname: "",
  accountNumber: "",
  country: "",
  estimateValue: "",
  specifyOwnershipType: "",


};

formErrorMessages = {
  bankname: {
    required: 'bankname is Required',
  },
  accountNumber: {
    required: 'accountNumber is Required',
    
    pattern: 'Only numeric values allowed',
  },
  country: {
    required: 'country is Required',
  },
  estimateValue: {
    required: 'estimateValue is Required',
  },
  specifyOwnershipType: {
    required: 'specifyOwnershipType is Required',
  },
  
};
addBankAccount(){
  console.log(this.BankAccountUser);
  
  if (this.BankAccountUser.invalid) {
    this.BankAccountUser.markAllAsTouched();
    this.formErrors = valueChanges(
      this.BankAccountUser,
      { ...this.formErrors },
      this.formErrorMessages
    );
    console.log("invalid");
    
    return;
  }
  this._userServ.addBankAccount(this.BankAccountUser.value).subscribe((result) => {
    console.log(result);
    if (result.sucess) {
      this._route.navigate(['/assets/assetsuccess'])
        }
    this.responseMessage=result.message;
  });
 
}
  ngOnInit(): void {
    this.createForm()
  }

}
