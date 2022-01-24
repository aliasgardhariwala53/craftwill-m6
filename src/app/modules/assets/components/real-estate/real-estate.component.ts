import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {

  realEstateForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }
  createForm(){
    this.realEstateForm= this._fb.group({
     address : ["",[Validators.required]],
     country: ["",[Validators.required]],
     specifyOwnershipType: ["",[Validators.required]],
    })
    this.realEstateForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.realEstateForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     address  : "",
     country: "",
     specifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    address  : {
       required: 'address   is Required',
     },
     country: {
       required: 'country is Required',
     },
   
     specifyOwnershipType: {
       required: 'specifyOwnershipType is Required',
     },
     
   };
   addRealEstatet(){
     console.log(this.realEstateForm);
     
     if (this.realEstateForm.invalid) {
       this.realEstateForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.realEstateForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     this._userServ.addRealEstate(this.realEstateForm.value).subscribe((result) => {
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
