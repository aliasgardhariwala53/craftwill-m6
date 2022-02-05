
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-create-trust',
  templateUrl: './create-trust.component.html',
  styleUrls: ['./create-trust.component.scss','../../../../app.component.scss']
})
export class CreateTrustComponent implements OnInit {

assetsId=[];
assetsData=[];
  TrustForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router,private toastr: ToastrService) { }

  createForm(){
 this.TrustForm= this._fb.group({
  trustName  : ["",[Validators.required]],
  description   : ["",[Validators.required]],

 })
 this.TrustForm.valueChanges.subscribe(() => {
  this.formErrors = valueChanges(
    this.TrustForm,
    { ...this.formErrors },
    this.formErrorMessages
  );
});
  }
formErrors = {

  trustName: "",
  description: "",



};

formErrorMessages = {
  trustName: {
    required: 'Trust Name is Required',
  },
 
  description: {
    required: 'Description is Required',
  },
 
  
};
addTrustForm(){
  console.log(this.TrustForm);
  
  if (this.TrustForm.invalid) {
    this.TrustForm.markAllAsTouched();
    this.TrustForm.markAsDirty();
    this.formErrors = valueChanges(
      this.TrustForm,
      { ...this.formErrors },
      this.formErrorMessages
    );
    console.log("invalid");
    return;
  }
  console.log(this.TrustForm.value);
  
  this._userServ.addTrust(this.TrustForm.value).subscribe((result) => {
    console.log(result);
    if (result.success) {
      this._route.navigate(['/trust/createTrust'])
        }
        this.toastr.message(result.message,result.success);
  });

 
}
  ngOnInit(): void {
    this.createForm()
    
  }

}