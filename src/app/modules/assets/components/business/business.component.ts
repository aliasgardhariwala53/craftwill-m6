
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  businessForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
  createForm(){
    this.businessForm= this._fb.group({
      businessName: ["",[Validators.required]],
      UEN_no : ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.businessForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.businessForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     businessName : "",
     UEN_no : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    businessName: {
       required: 'businessName  is Required',
     },
     UEN_no: {
       required: 'UEN_no  is Required',
       
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
     },
     
   };
   addBusiness(){
     console.log(this.businessForm);
     
     if (this.businessForm.invalid) {
       this.businessForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.businessForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     this._userServ.addBusiness(this.businessForm.value).subscribe((result) => {
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
