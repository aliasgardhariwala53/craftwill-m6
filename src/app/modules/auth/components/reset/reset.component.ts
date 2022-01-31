import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordValidation, valueChanges } from 'src/app/helper/formerror.helper';
import { AuthservicesService } from 'src/app/services/authservices.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})



export class ResetComponent implements OnInit {

  resetForm :FormGroup;
  message : string;

  constructor(private _authServ :AuthservicesService, private _fb :FormBuilder, private _actRoute :ActivatedRoute,
    private _router :Router) { }


  createForm(){
    this.resetForm = this._fb.group({
      _id : null,
      password : ["", [Validators.required, Validators.minLength(6)]],
      newPassword : ["", [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: [passwordValidation.match('password', 'newPassword')]
    })

    this.resetForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(this.resetForm, {...this.formErrors}, this.formErrorMessages);
    });
  }

  formErrors = {
    password: '',
    newPassword: ''
  };

  formErrorMessages = {
    password: {
      required: 'New Password is Required',
      minlength: 'Minimum length must be 6'
    },
    newPassword: {
      required: 'Confirm Password is Required',
      minlength: 'Minimum length must be 6',
      matching: 'New Password and confirm password should be same'
    }
  };

  resetPassword(){
    console.log(this.resetForm.value);
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.formErrors = valueChanges(this.resetForm, {...this.formErrors}, this.formErrorMessages);
      return;
    }
    this.resetForm.value._id = this._actRoute.snapshot.params['id']

    this._authServ.resetPassword({
      "_id" : this.resetForm.value._id,
      "newPassword" : this.resetForm.value.password
    }).subscribe((result)=>{
      console.log(result);
      if(result.sucess == true){
        this._router.navigate(["/"])
      }
      else{
        this.message = "Something went wrong";
      }
    })
  }


  ngOnInit(): void {
    this.createForm();
  }

}
