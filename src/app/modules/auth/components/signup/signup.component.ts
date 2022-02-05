import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidation, valueChanges } from 'src/app/helper/formerror.helper';
import { AuthservicesService } from 'src/app/services/authservices.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  step: any = 1;
  userRegistration: FormGroup;
  accountDetails: FormGroup;
  addressDetails: FormGroup;
  message: string;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthservicesService,
    private _router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.userRegistration = this._fb.group({
      id_type: ['', Validators.required],
      id_number: ['', Validators.required],
      fullName: ['', Validators.required],
    });
    this.accountDetails = this._fb.group({
      gender: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
     
    },
    {
      validators:[passwordValidation.match('password','confirmPassword')]
    }
    
    );
    this.addressDetails = this._fb.group({
      floorNumber: ['', Validators.required],
      unitNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      postalCode: ['', [Validators.required,, Validators.pattern("^[0-9]*$")]],
    });

    this.userRegistration.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.userRegistration,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.accountDetails.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.accountDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.addressDetails.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.addressDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    id_type: '',
    id_number: '',
    gender: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
  };

  formErrorMessages = {
    id_type: {
      required: 'Id Type is Required',
    },
    id_number: {
      required: 'id Number is Required',
    },
    gender: {
      required: 'Gender is Required',
    },
    fullName: {
      required: 'fullName is Required',
    },
    email: {
      required: 'Email is Required',
      pattern: 'Valid email is Required',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Minimum length of password must be 6',
    },
    confirmPassword: {
      required: 'confirm Password is Required',
      matching: 'Password not matched'
    },
    floorNumber: {
      required: 'Floor Number is Required',
    },
    unitNumber: {
      required: 'Unit Number is Required',
    },
    streetName: {
      required: 'Street Name is Required',
    },
    postalCode: {
      required: 'Postal Code is Required',
      pattern: 'Please Enter valid numeric value',
    },
 
  };
  submit() {
    console.log('Helloo');

  let obj={
    id_type:this.userRegistration.value.id_type,
    id_number:this.userRegistration.value.id_number,
    fullName:this.userRegistration.value.fullName,
    gender:this.accountDetails.value.gender,
    email:this.accountDetails.value.email,
    password:this.accountDetails.value.password,
    floorNumber:this.addressDetails.value.floorNumber,
    unitNumber:this.addressDetails.value.unitNumber,
    streetName:this.addressDetails.value.streetName,
    postalCode:this.addressDetails.value.postalCode,
  }
    console.log(obj);

    this._authService.signup(obj).subscribe(
      (result) => {
        console.log(result);
        this.toastr.message(result.message,result.success);
        if (result.success == true) {
        
          this._router.navigate(['/']);
        }
      },
     
    );
  }


  next(value) {
  
    if (value == 2 && this.userRegistration.invalid) {
      console.log("is 2");
      this.userRegistration.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userRegistration,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 3 && this.accountDetails.invalid) {
      console.log("is 3");
      this.accountDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.accountDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 4 && this.addressDetails.invalid) {
      console.log("is 4");
      this.addressDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.addressDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }

    if (value == 5) {
      console.log("is 5");
      this.submit();
    } 
      this.step = value;
      console.log(this.step);
  }
}
