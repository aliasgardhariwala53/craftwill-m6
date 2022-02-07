
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-moter-vehicle',
  templateUrl: './moter-vehicle.component.html',
  styleUrls: ['./moter-vehicle.component.scss']
})
export class MoterVehicleComponent implements OnInit {

  vehicleForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private spinner:NgxUiLoaderService,private _route:Router,private toastr: ToastrService) { }  
  createForm(){
    this.vehicleForm= this._fb.group({
      CarModel: ["",[Validators.required]],
      plateNo : ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
     country: ["",[Validators.required]],
     SpecifyOwnershipType: ["",[Validators.required]],
    })
    this.vehicleForm.valueChanges.subscribe(() => {
     this.formErrors = valueChanges(
       this.vehicleForm,
       { ...this.formErrors },
       this.formErrorMessages
     );
   });
     }
   formErrors = {
   
     CarModel : "",
     plateNo : "",
     country: "",
     SpecifyOwnershipType: "",
   
   
   };
   
   formErrorMessages = {
    CarModel: {
       required: 'Vehicle Model is Required',
     },
     plateNo: {
       required: 'Plate No  is Required',
       
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'Country is Required',
     },
   
     SpecifyOwnershipType: {
       required: 'Ownership is Required',
     },
     
   };
   addVehicle(){
    this.spinner.start();
     console.log(this.vehicleForm);
     
     if (this.vehicleForm.invalid) {
       this.vehicleForm.markAllAsTouched();
       this.formErrors = valueChanges(
         this.vehicleForm,
         { ...this.formErrors },
         this.formErrorMessages
       );
       console.log("invalid");
       
       return;
     }
     const VehicletData = {
      country: this.vehicleForm.value.country,
      specifyOwnershipType: this.vehicleForm.value.specifyOwnershipType,
      motorVehicle: this.vehicleForm.value,
      type:'motorVehicle'
    };
     this._userServ.addAssets(VehicletData).subscribe((result) => {
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
