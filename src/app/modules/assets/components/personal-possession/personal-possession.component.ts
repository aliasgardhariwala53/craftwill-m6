

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-personal-possession',
  templateUrl: './personal-possession.component.html',
  styleUrls: ['./personal-possession.component.scss']
})
export class PersonalPossessionComponent implements OnInit {

  personalPossessionForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
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
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
     },
     
   };
   addPossession(){
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
     this._userServ.addpersonalPossession(this.personalPossessionForm.value).subscribe((result) => {
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
