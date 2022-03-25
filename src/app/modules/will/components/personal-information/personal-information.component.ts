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
      fullName: ['',[Validators.required,Validators.maxLength(64)]],
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
      required: 'Id Type is required',
    },
    id_Number: {
      required: 'Id Number is required',
      maxlength: 'Please Enter Valid Id number',
      pattern: 'Invalid Id number',
    },
    gender: {
      required: 'Gender is required',
    },
    fullName: {
      required: 'Full name is required',
      maxlength: 'Please Enter Valid name',
    },
    email: {
      required: 'Email is required',
      pattern: 'Valid email is required',
    },
    password: {
      required: 'Password is required',
      minlength: 'Minimum length of password must be 6',
    },
    floorNumber: {
      required: 'Floor Number is required',
      maxlength: 'Please Enter Valid floor Number',
    },
    unitNumber: {
      required: 'Unit Number is required',
      maxlength: 'Please Enter Valid unit Number',
    },
    streetName: {
      required: 'Street Name is required',
    },
    postalCode: {
      required: 'Postal Code is required',
      pattern: 'Please Enter valid numeric value',
      maxlength: 'Please Enter Valid postal code',
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
