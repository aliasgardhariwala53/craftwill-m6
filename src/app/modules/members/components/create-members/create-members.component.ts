import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-create-members',
  templateUrl: './create-members.component.html',
  styleUrls: [
    './create-members.component.scss',
    '../../../../app.component.scss',
  ],
})
export class CreateMembersComponent implements OnInit {
  memberType: string = 'person';
  personForm: FormGroup;
  organisationForm: FormGroup;
  responseMessageperson: string = '';
  responseMessageOrganisation: string = '';
  currentItem: string = 'Create Member';
  genderList= ['Male','Female','Other']
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private toastr: ToastrService,
    private spinner:NgxUiLoaderService,
    private _route:Router,
  ) {}

  createForm() {
    this.personForm = this._fb.group({
      fullname: ['', [Validators.required]],
      id_type: ['', Validators.required],
      id_number: ['', Validators.required],
      gender: [, Validators.required],
      floorNumber: ['', Validators.required],
      unitNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      id_country: ['', Validators.required],
      dob: ['', Validators.required],
      Relationship: ['', Validators.required],
    });
    this.organisationForm = this._fb.group({
      organisationName: ['', [Validators.required]],
      registration_number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      id_country: ['', Validators.required],

      floorNumber: ['', Validators.required],
      unitNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.personForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.personForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.organisationForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.organisationForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    id_type: '',
    id_number: '',
    gender: '',
    fullname: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
    Relationship: '',
    dob: '',
    id_country: '',
    registration_number: '',
    organisationName: '',
  };

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
    fullname: {
      required: 'Fullname is Required',
    },
    dob: {
      required: 'Date of birth is Required',
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
    Relationship: {
      required: 'Relationship is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    id_country: {
      required: 'Country is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    registration_number: {
      required: 'Registration Number is Required',
      pattern: 'Please Enter valid registration number',
    },
    organisationName: {
      required: 'Organisation is Required',
      // pattern: 'Please Enter valid numeric value',
    },
  };
  memberUpdate() {
    console.log(this.personForm);
   
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.personForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const membersASPerson = {
      country: this.personForm.value.id_country,
      memberAsPerson: { ...this.personForm.value ,gender:this.personForm.value.gender.toLowerCase()},
      type:'memberAsPerson',
    };

    this._userServ.createMembers(membersASPerson).subscribe((result) => {
      console.log('result');
      this.spinner.stop();
      if (result.success) {
        this.personForm.reset();
        this._route.navigate(['/members'])
      }
      this.toastr.message(result.message, result.success);
    });
  }
  organisationUpdate() {

    if (this.organisationForm.invalid) {
      this.organisationForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.organisationForm,
        { ...this.formErrors },
        this.formErrorMessages
      );

      return;
    }
    this.spinner.start();
    const membersAsOrganisation = {
      country: this.organisationForm.value.id_country,
      memberAsOrganisation: { ...this.organisationForm.value },
      type:'memberAsOrganisation',
    };
    this._userServ.createMembers(membersAsOrganisation).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.organisationForm.reset();
        this._route.navigate(['/members'])
      }
      this.toastr.message(result.message, result.success);
      // this.responseMessageOrganisation=result.message;
    },(err)=>{
      
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
}
