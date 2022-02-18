import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
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
      id_Number: [],
      id_Type: [],
      fullName: [''],
      gender: [],
      email: [''],
      floorNumber: [''],
      unitNumber: [''],
      streetName: [''],
      postalCode: [''],
      assetScope: ['Singapore'],
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
    this._willServices.step1.subscribe((step1Data) => {
      console.log(step1Data);
      this.userInfo.setValue(step1Data);
    });
  }

}
