import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent implements OnInit {

  realEstateForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private spinner:NgxUiLoaderService,private _route:Router,private toastr: ToastrService) { }
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
       required: 'Address is Required',
     },
     country: {
       required: 'Country is Required',
     },
   
     specifyOwnershipType: {
       required: 'Ownership is Required',
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
     this.spinner.start();
     const realEstateData = {
      country: this.realEstateForm.value.country,
      specifyOwnershipType: this.realEstateForm.value.specifyOwnershipType,
      realEstate: this.realEstateForm.value,
      type:'realEstate'
    };
    
     this._userServ.addAssets(realEstateData).subscribe((result) => {
       this.spinner.stop();
       if (result.success) {
        this.realEstateForm.reset();
        this._route.navigate(['/assets/assetsuccess'])
          }
          this.toastr.message(result.message,result.success);
     });
    
   }
     ngOnInit(): void {
       this.createForm()
     }
}
