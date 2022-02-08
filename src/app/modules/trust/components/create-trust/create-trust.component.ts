
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
trustData=[];
  TrustForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private spinner:NgxUiLoaderService,private _route:Router,private toastr: ToastrService,private _actRoute :ActivatedRoute) { }

  createForm(){
 this.TrustForm= this._fb.group({
  trustName  : ["",[Validators.required]],
  description   : ["",[Validators.required]],
_id:[""]
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
onUpdateTrust(){
  this.TrustForm.value._id = this._actRoute.snapshot.params['id']
  
}
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
  this.spinner.start();
  console.log(this.TrustForm.value);
  
  this._userServ.addTrust(this.TrustForm.value).subscribe((result) => {
    this.spinner.stop();
    if (result.success) {
      this.TrustForm.reset();
      this._route.navigate(['/trust'])
        }
   
        this.toastr.message(result.message,result.success);
  });

 
}
  ngOnInit(): void {
    this.createForm()
    this._userServ.getTrust().subscribe((result) => {
      

      this.trustData = result.data.users.filter((items, i) => {
        return items._id===this._actRoute.snapshot.params['id'];
      });
      console.log(this.trustData);
      
      this.trustData = this.trustData.map((items, i) => {
        return {
          trustName: items.trustName,
          ownerShipType: 'sole',
          _id: items._id,
        };
      });
      console.log(...this.trustData);
      this.TrustForm.setValue({trustName:this.trustData[0].trustName,description:this.trustData[0].ownerShipType,_id:this.trustData[0]._id})
      this.TrustForm.value.trustName=this.trustData[0].trustName;
      
    });
  }

}