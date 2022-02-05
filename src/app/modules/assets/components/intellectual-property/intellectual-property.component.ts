

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-intellectual-property',
  templateUrl: './intellectual-property.component.html',
  styleUrls: ['./intellectual-property.component.scss']
})
export class IntellectualPropertyComponent implements OnInit {

  IntellectualPropertyForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router,private toastr: ToastrService) { }
  createForm(){
    this.IntellectualPropertyForm= this._fb.group({
      ip_Name: ["",[Validators.required]],
      ip_No : ["",[Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     SpecifyOwnershipType: ["",[Validators.required]],
    })
    this.IntellectualPropertyForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.IntellectualPropertyForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     ip_Name : "",
     ip_No : "",
     country: "",
     SpecifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    ip_Name: {
       required: 'Ip Name  is Required',
     },
     ip_No: {
     
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'Country is Required',
     },
   
     SpecifyOwnershipType: {
       required: 'Ownership is Required',
     },
     
   };
   addProperty(){
     console.log(this.IntellectualPropertyForm);
     
     if (this.IntellectualPropertyForm.invalid) {
       this.IntellectualPropertyForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.IntellectualPropertyForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     const intellectualData = {
      country: this.IntellectualPropertyForm.value.country,
      specifyOwnershipType: this.IntellectualPropertyForm.value.specifyOwnershipType,
      intellectualProperty: this.IntellectualPropertyForm.value,
      type:'intellectualProperty'
    };
     this._userServ.addAssets(intellectualData).subscribe((result) => {
       console.log(result);
       if (result.success) {
        this._route.navigate(['/assets/assetsuccess'])
          }
          this.toastr.message(result.message,result.success);
     });
    
   }
     ngOnInit(): void {
       this.createForm()
     }
}
