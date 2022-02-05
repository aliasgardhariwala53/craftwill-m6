import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit {
  businessForm: FormGroup;
  responseMessage: string;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private _route: Router,
    private toastr: ToastrService
  ) {}
  createForm() {
    this.businessForm = this._fb.group({
      businessName: ['', [Validators.required]],
      UEN_no: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: ['', [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.businessForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.businessForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    businessName: '',
    UEN_no: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    businessName: {
      required: 'Business Name  is Required',
    },
    UEN_no: {
      required: 'UEN No. is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addBusiness() {
    console.log(this.businessForm);

    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.businessForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    const businessData = {
      country: this.businessForm.value.country,
      specifyOwnershipType: this.businessForm.value.specifyOwnershipType,
      business: this.businessForm.value,
      type:'business'
    };
    this._userServ.addAssets(businessData).subscribe((result) => {
      console.log(result);
      this.toastr.message(result.message,result.success);
      if (result.success) {
        this._route.navigate(['/assets/assetsuccess']);
      }
    
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
}
