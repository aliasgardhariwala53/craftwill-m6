import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  @Input() reviewDisable=false;
  @Output() onClickNextBtn = new EventEmitter();
  constructor(private _fb:FormBuilder,private _willServices: WillService) {
   

   }
  idList = ['NRIC', 'Passport', 'FIN', 'Others'];
  genderList = ['Male', 'Female', 'Other'];
  userInfo: FormGroup;
  pageTitle;
  step=1;
  createForm() {
    this.userInfo = this._fb.group({
      id_Number: ['',[Validators.required,
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.maxLength(24),
      ]],
      id_Type: [ ,Validators.required],
      fullName: ['',Validators.required],
      gender: [, [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],],
      floorNumber: ['', [Validators.required, Validators.maxLength(12)]],
      unitNumber: ['', [Validators.required, Validators.maxLength(12)]],
      streetName: ['',[Validators.required] ],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(12)]],
      assetScope: ['singapore',Validators.required],
    });

    this.userInfo.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });

  }
  formErrors = {
    id_Type: '',
    id_Number: '',
    gender: '',
    fullName: '',
    email: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
    assetScope: '',

  };
  onClickNext(){
        if (this.userInfo.invalid) {
      console.log('is 2');
      this.userInfo.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.onClickNextBtn.emit(2);
    this._willServices.step1.next(this.userInfo.value);
  }
  formErrorMessages = {
    id_Type: {
      required: 'Id Type is Required',
    },
    id_Number: {
      required: 'Id Number is Required',
    },
    gender: {
      required: 'Gender is Required',
    },
    fullName: {
      required: 'FullName is Required',
    },
    email: {
      required: 'Email is Required',
      pattern: 'Valid email is Required',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Minimum length of password must be 6',
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
      // pattern: 'Please Enter valid numeric value',
    },

  };
  ngOnInit(): void {
    this.createForm();
    if (this.reviewDisable) {
      this.userInfo.disable();
    }
    this._willServices.step1.subscribe((step1Data) => {
      console.log(step1Data);
      this.userInfo.patchValue(step1Data);
    });
  }

}
