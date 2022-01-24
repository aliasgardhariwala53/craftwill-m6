import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-investment-account',
  templateUrl: './investment-account.component.html',
  styleUrls: ['./investment-account.component.scss']
})
export class InvestmentAccountComponent implements OnInit {
 
  InvestmentAccountUser:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
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
       required: 'account Name  is Required',
     },
     accountNo : {
       required: 'accountNo  is Required',
       
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
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
     this._userServ.addInvestmentAccont(this.InvestmentAccountUser.value).subscribe((result) => {
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