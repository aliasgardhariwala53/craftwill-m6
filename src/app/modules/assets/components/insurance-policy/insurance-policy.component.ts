
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styleUrls: ['./insurance-policy.component.scss']
})
export class InsurancePolicyComponent implements OnInit {

  insuranceForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
  createForm(){
    this.insuranceForm= this._fb.group({
     policyName: ["",[Validators.required]],
     policyNumber: ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.insuranceForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.insuranceForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     policyName : "",
     policyNumber : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    policyName : {
       required: 'policyName  is Required',
     },
     policyNumber : {
       required: 'policyNumber  is Required',
       
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
     },
     
   };
   addinsurance(){
     console.log(this.insuranceForm);
     
     if (this.insuranceForm.invalid) {
       this.insuranceForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.insuranceForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     this._userServ.addInsurance(this.insuranceForm.value).subscribe((result) => {
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
