import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-investment-account',
  templateUrl: './investment-account.component.html',
  styleUrls: ['./investment-account.component.scss']
})
export class InvestmentAccountComponent implements OnInit {
 
  InvestmentAccountUser:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router,private toastr: ToastrService) { }
  createForm(){
    this.InvestmentAccountUser= this._fb.group({
     accountName: ["",[Validators.required]],
     accountNo: ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.InvestmentAccountUser.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.InvestmentAccountUser,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     accountName : "",
     accountNo : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    accountName : {
       required: 'Account Name  is Required',
     },
     accountNo : {
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
   addinvestmentAccount(){
     console.log(this.InvestmentAccountUser);
     
     if (this.InvestmentAccountUser.invalid) {
       this.InvestmentAccountUser.markAllAsTouched();
       this.formErrors = valueChanges(
         this.InvestmentAccountUser,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     const InvestmentData = {
      country: this.InvestmentAccountUser.value.country,
      specifyOwnershipType: this.InvestmentAccountUser.value.specifyOwnershipType,
      investmentAccount: this.InvestmentAccountUser.value,
    };
     this._userServ.addAssets(InvestmentData).subscribe((result) => {
       console.log(result);
       if (result.sucess) {
        this._route.navigate(['/assets/assetsuccess'])
          }
          this.toastr.message(result.message,result.success);
     });
    
   }
     ngOnInit(): void {
       this.createForm()
     }
}
