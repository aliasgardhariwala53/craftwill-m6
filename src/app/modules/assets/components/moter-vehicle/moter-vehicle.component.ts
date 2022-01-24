
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-moter-vehicle',
  templateUrl: './moter-vehicle.component.html',
  styleUrls: ['./moter-vehicle.component.scss']
})
export class MoterVehicleComponent implements OnInit {

  vehicleForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }  
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
       required: 'CarModel  is Required',
     },
     plateNo: {
       required: 'plateNo  is Required',
       
       pattern: 'Only numeric values allowed',
     },
     country: {
       required: 'country is Required',
     },
   
     SpecifyOwnershipType: {
       required: 'SpecifyOwnershipType is Required',
     },
     
   };
   addVehicle(){
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
     this._userServ.addMoterVehicle(this.vehicleForm.value).subscribe((result) => {
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
