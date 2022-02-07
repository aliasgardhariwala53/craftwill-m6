

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-personal-possession',
  templateUrl: './personal-possession.component.html',
  styleUrls: ['./personal-possession.component.scss']
})
export class PersonalPossessionComponent implements OnInit {

  personalPossessionForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private spinner:NgxUiLoaderService,private _route:Router,private toastr: ToastrService) { }
  createForm(){
    this.personalPossessionForm= this._fb.group({
      Name: ["",[Validators.required]],
      id_No : ["",[ Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.personalPossessionForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.personalPossessionForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     Name : "",
     id_No : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    Name: {
       required: 'Name  is Required',
     },
     id_No: {
     
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'Country is Required',
     },
   
     specifyOwnershipType: {
       required: 'Ownership is Required',
     },
     
   };
   addPossession(){
    this.spinner.start();
     console.log(this.personalPossessionForm);
     
     if (this.personalPossessionForm.invalid) {
       this.personalPossessionForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.personalPossessionForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     const possessionData = {
      country: this.personalPossessionForm.value.country,
      specifyOwnershipType: this.personalPossessionForm.value.specifyOwnershipType,
      personalPossession: this.personalPossessionForm.value,
      type:'personalPossession'
    };
     this._userServ.addAssets(possessionData).subscribe((result) => {
       this.spinner.stop();
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
