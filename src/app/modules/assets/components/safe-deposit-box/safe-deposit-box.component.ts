

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-safe-deposit-box',
  templateUrl: './safe-deposit-box.component.html',
  styleUrls: ['./safe-deposit-box.component.scss']
})
export class SafeDepositBoxComponent implements OnInit {

  safeDepositboxForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
  createForm(){
    this.safeDepositboxForm= this._fb.group({
      safe_Box_Location: ["",[Validators.required]],
      safe_No : ["",[ Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.safeDepositboxForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.safeDepositboxForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     safe_Box_Location : "",
     safe_No : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    safe_Box_Location: {
       required: 'safe Box Location  is Required',
     },
     safe_No: {
     
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
     },
     
   };
   addDepositbox(){
     console.log(this.safeDepositboxForm);
     
     if (this.safeDepositboxForm.invalid) {
       this.safeDepositboxForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.safeDepositboxForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     this._userServ.addsafeDepositbox(this.safeDepositboxForm.value).subscribe((result) => {
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
