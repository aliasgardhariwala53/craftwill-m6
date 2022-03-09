import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  errorHandler,
  passwordValidation,
  valueChanges,
} from 'src/app/helper/formerror.helper';
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
  options: any[] = [
    { _id: '1', status: 'waiting' },
    { _id: '2', status: 'open' },
    { _id: '3', status: 'in_progress' },
    { _id: '4', status: 'close' },
  ];

  idList = ['NRIC', 'Passport', 'FIN'];
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthservicesService,
    private _router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}
  emailVerifyDisable=false;
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.userRegistration = this._fb.group({
      id_type: new FormControl(null, Validators.required),

      id_number: ['',[Validators.required,
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.maxLength(24),
      ]],
      fullName: ['', [Validators.required,
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.maxLength(32),
      ]],
    });
    this.accountDetails = this._fb.group(
      {
        gender: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [passwordValidation.match('password', 'confirmPassword')],
      }
    );
    this.addressDetails = this._fb.group({
      floorNumber: ['', [ Validators.maxLength(12)]],
      unitNumber: ['', [ Validators.maxLength(12)]],
      streetName: ['' ],
      postalCode: ['', [ Validators.pattern('^[0-9]*$'), Validators.maxLength(12)]],
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
      required: 'Id Number is Required',
      pattern: 'Invalid Id Number',
      maxlength: 'Invalid Id Number',
    },
    gender: {
      required: 'Gender is Required',
    },
    fullName: {
      required: 'Full Name is Required',
      pattern: 'Invalid Name',
      maxlength: 'Invalid Name',
    },
    email: {
      required: 'Email is Required',
      pattern: 'Valid email is Required',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Minimum length of password must be 6',
      maxlength: 'Password Not Allowed',
    },
    confirmPassword: {
      required: 'Confirm Password is Required',
      matching: 'Password not matched',
    },
    floorNumber: {
      required: 'Floor Number is Required',
      maxlength: 'Invalid Number ',
    },
    unitNumber: {
      required: 'Unit Number is Required',
      maxlength: 'Invalid Number ',
    },
    streetName: {
      required: 'Street Name is Required',
    },
    postalCode: {
      required: 'Postal Code is Required',
      pattern: 'Please Enter valid numeric value',
      maxlength: 'Invalid Number ',
    },
  };
  submit() {
    this.spinner.start();
    console.log('Helloo');

    let obj = {
      id_type: this.userRegistration.value.id_type,
      id_number: this.userRegistration.value.id_number,
      fullName: this.userRegistration.value.fullName,
      gender: this.accountDetails.value.gender,
      email: this.accountDetails.value.email,
      password: this.accountDetails.value.password,
      floorNumber: this.addressDetails.value.floorNumber,
      unitNumber: this.addressDetails.value.unitNumber,
      streetName: this.addressDetails.value.streetName,
      postalCode: this.addressDetails.value.postalCode,
    };
    console.log(obj);

    this._authService.signup(obj).subscribe((result) => {
      this.spinner.stop();
      this.toastr.message(result.message, result.success);
      if (result.message === 'User already exists') {
        // this.step = 2;
        this._router.navigate(['/login']);
        return;
      }
      if (result.success == true) {
        this.userRegistration.reset();
        this.addressDetails.reset();
        this.accountDetails.reset();
        this.toastr.message("Email Verification link has been send to your mail....",true);
        this._router.navigate(['/'], { queryParams:{en:"true"}});
        this.emailVerifyDisable=true;
        
      }
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }

  next(value) {
    if (value == 2 && this.userRegistration.invalid) {
      console.log('is 2');
      this.userRegistration.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userRegistration,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 3 && this.accountDetails.invalid) {
      console.log('is 3');
      this.accountDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.accountDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 4 && this.addressDetails.invalid) {
      console.log('is 4');
      this.addressDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.addressDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }

    if (value == 3) {
      console.log('is 5');
    }
    this.step = value;
    console.log(this.step);
  }
  signupSendEmail(){
    if ( this.accountDetails.invalid) {
      console.log('is 3');
      this.accountDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.accountDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.submit();
  }
}
