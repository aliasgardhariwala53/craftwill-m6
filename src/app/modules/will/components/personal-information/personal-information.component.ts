import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  @Output() onClickNextBtn = new EventEmitter();
  constructor(private _fb:FormBuilder) { }
  idList = ['NRIC', 'Passport', 'FIN', 'Others'];
  genderList = ['Male', 'Female', 'Other'];
  userInfo: FormGroup;
  pageTitle;
  step=1;
  createForm() {
    this.userInfo = this._fb.group({
      fullName: [''],
      email: [''],
      id_type: [],
      id_number: [''],
      gender: [],
      floorNumber: [''],
      unitNumber: [''],
      streetName: [''],
      postalCode: [''],
      specifyOwnershipType: [''],
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
    id_type: '',
    id_number: '',
    gender: '',
    fullName: '',
    email: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
    specifyOwnershipType: '',

  };
  onClickNext(){
    this.onClickNextBtn.emit(2)
  }
  formErrorMessages = {
    id_type: {
      required: 'Id Type is Required',
    },
    id_number: {
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
    this.createForm()
  }

}
