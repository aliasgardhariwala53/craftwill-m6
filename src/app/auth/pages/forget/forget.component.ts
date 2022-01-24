import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { AuthservicesService } from '../../../services/authservices.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})


export class ForgetComponent implements OnInit {

  constructor(private _authServ :AuthservicesService, private _fb :FormBuilder) { }

  forgotForm :FormGroup;
  message : string;
  error : string;

  createForm(){
    this.forgotForm = this._fb.group({
      email : ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    })

    this.forgotForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(this.forgotForm, {...this.formErrors}, this.formErrorMessages);
    });
  }

  formErrors = {
    email: ''
  };

  formErrorMessages = {
    email: {
      required: 'Email is Required',
      pattern: 'Valid email is required'
    }
  };

  forgotPassword(){
    console.log(this.forgotForm.value);
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      this.formErrors = valueChanges(this.forgotForm, {...this.formErrors}, this.formErrorMessages);
      return;
    }
    console.log(this.forgotForm.value);
    this._authServ.forgotPassword(this.forgotForm.value).subscribe((result)=>{
      console.log(result);
      if(result.sucess == true){
        this.message = result.message
      }
    })
  }

  ngOnInit(): void {
    this.createForm();
  }

}
