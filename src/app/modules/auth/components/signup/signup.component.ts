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
  CustomValidators,
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
  emailVerifyDisable = false;
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.userRegistration = this._fb.group({
      id_type: new FormControl(null, Validators.required),

      id_number: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]*'),
          Validators.maxLength(16),
        ],
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z ]*'),
          Validators.maxLength(32),
        ],
      ],
    });
    this.accountDetails = this._fb.group(
      {
        gender: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(32),
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [
          passwordValidation.match('password', 'confirmPassword'),
          // CustomValidators.patternValidator('password', /\d/, {
          //   oneNumber: true,
          // }),
          // CustomValidators.patternValidator('password', /[A-Z]/, {
          //   oneCapital: true,
          // }),
          // CustomValidators.patternValidator('password', /[a-z]/, {
          //   oneSmall: true,
          // }),
          // CustomValidators.patternValidator(
          //   'password',
          //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          //   { oneSpecial: true }
          // ),
        ],
      }
    );
    this.addressDetails = this._fb.group({
      floorNumber: ['', [Validators.maxLength(6)]],
      unitNumber: ['', [Validators.maxLength(6)]],
      streetName: [''],
      postalCode: [
        '',
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(12)],
      ],
    });

    this.userRegistration.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.userRegistration,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.accountDetails.valueChanges.subscribe(() => {
      //console.log(this.accountDetails.controls['password'].hasError('pattern'));
      //console.log(this.accountDetails.controls['password'].hasError('required'));
      
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
      required: 'Id Type is required.',
    },
    id_number: {
      required: 'Id Number is required.',
      pattern: 'Invalid Id Number',
      maxlength: 'Invalid Id Number',
    },
    gender: {
      required: 'Gender is required.',
    },
    fullName: {
      required: 'Full Name is required.',
      pattern: 'Invalid Name',
      maxlength: 'Invalid Name',
    },
    email: {
      required: 'Email is required.',
      pattern:
        'Please enter valid email address.For example johndoe@domain.com ',
    },
    password: {
      required: 'Password is required.',
      pattern:
        'Your password must contain at least one uppercase, one lowercase,one special character and one number',
      minlength: 'Minimum length of password must be 6',
      maxlength: 'Password Not Allowed',
      oneNumber: 'Must contain at least 1 number!',
      oneCapital: 'Must contain at least 1 in Capital Case!',
      oneSmall: ' Must contain at least 1 Letter in Small Case!',
      oneSpecial: ' Must contain at least 1 Special Character!',
    },
    confirmPassword: {
      required: 'Confirm Password is required.',
      matching: 'Password not matched',
    },
    floorNumber: {
      required: 'Floor Number is required.',
      maxlength: 'Invalid Number ',
    },
    unitNumber: {
      required: 'Unit Number is required.',
      maxlength: 'Invalid Number ',
    },
    streetName: {
      required: 'Street Name is required.',
    },
    postalCode: {
      required: 'Postal Code is required.',
      pattern: 'Please Enter valid numeric value',
      maxlength: 'Please Enter Valid postal code',
    },
  };
  submit() {
    this.spinner.start();
    //console.log('Helloo');

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
    //console.log(obj);

    this._authService.signup(obj).subscribe(
      (result) => {
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
          this.toastr.message(
            'Email Verification link has been send to your mail....',
            true
          );
          this._router.navigate(['/'], { queryParams: { en: 'true' } });
          this.emailVerifyDisable = true;
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  next(value) {
    if (value == 2 && this.userRegistration.invalid) {
      //console.log('is 2');
      this.userRegistration.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userRegistration,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 3 && this.accountDetails.invalid) {
      //console.log('is 3');
      this.accountDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.accountDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    if (value == 4 && this.addressDetails.invalid) {
      //console.log('is 4');
      this.addressDetails.markAllAsTouched();
      this.formErrors = valueChanges(
        this.addressDetails,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }

    if (value == 3) {
      //console.log('is 5');
    }
    this.step = value;
    //console.log(this.step);
  }
  signupSendEmail() {
    if (this.accountDetails.invalid) {
      //console.log('is 3');
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
