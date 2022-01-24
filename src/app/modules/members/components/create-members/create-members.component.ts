
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-create-members',
  templateUrl: './create-members.component.html',
  styleUrls: ['./create-members.component.scss','../../../../app.component.scss']
})
export class CreateMembersComponent implements OnInit {

  memberType:string='person'
  personForm:FormGroup
  organisationForm:FormGroup
  responseMessageperson:string="";
  responseMessageOrganisation:string="";
  currentItem:string="Create Member";
  constructor(private _fb:FormBuilder,private _userServ:UserService) { }


  createForm() {
    this.personForm = this._fb.group({
      fullname: ["",[Validators.required]],
      id_type: ["",Validators.required],
      id_number: ["",Validators.required],
      gender: ["",Validators.required],
      floorNumber: ["",Validators.required],
      unitNumber: ["",Validators.required],
      streetName: ["",Validators.required],
      postalCode: ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
      id_country: ["",Validators.required],
      dob: ["",Validators.required],
      Relationship: ["",Validators.required],
    });
    this.organisationForm = this._fb.group({
      organisationName: ["",[Validators.required]],
      registration_number: ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
      id_country: ["",Validators.required],
     
      floorNumber: ["",Validators.required],
      unitNumber: ["",Validators.required],
      streetName: ["",Validators.required],
      postalCode: ["",[Validators.required, Validators.pattern("^[0-9]*$")]],

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
    id_type: "",
    id_number: "",
    gender: "",
    fullname: "",
    floorNumber: "",
    unitNumber: "",
    streetName: "",
    postalCode: "",
    Relationship: "",
    dob: "",
    id_country: "",
    registration_number: "",
    organisationName: "",

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
    fullname: {
      required: 'fullname is Required',
    },
    dob: {
      required: 'Date of birth is Required',
    },

    floorNumber: {
      required: 'floorNumber is Required',
    },
    unitNumber: {
      required: 'unitNumber is Required',
    },
    streetName: {
      required: 'streetName is Required',
    },
    postalCode: {
      required: 'postalCode is Required',
      pattern: 'Please Enter valid numeric value',
    },
    Relationship: {
      required: 'Relationship is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    id_country: {
      required: 'country is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    registration_number: {
      required: 'registration is Required',
      pattern: 'Please Enter valid registration number',
    },
    organisationName: {
      required: 'Organisation is Required',
      // pattern: 'Please Enter valid numeric value',
    },
  };
memberUpdate(){
  console.log(this.personForm);
  
  if (this.personForm.invalid) {
    this.personForm.markAllAsTouched();
    this.formErrors = valueChanges(
      this.personForm,
      { ...this.formErrors },
      this.formErrorMessages
    );
    console.log("invalid");
    
    return;
  }
  this._userServ.createMembersperson(this.personForm.value).subscribe((result) => {
    console.log(result);
    this.responseMessageperson=result.message;
  });
 
}
organisationUpdate(){
  
  if (this.organisationForm.invalid) {
    this.organisationForm.markAllAsTouched();
    this.formErrors = valueChanges(
      this.organisationForm,
      { ...this.formErrors },
      this.formErrorMessages
    );
    
    return;
  }
  this._userServ.createMemberOrganisation(this.organisationForm.value).subscribe((result) => {
    console.log(result);
    this.responseMessageOrganisation=result.message;
  });
 
}
ngOnInit(): void {
  this.createForm();

 
}
}
