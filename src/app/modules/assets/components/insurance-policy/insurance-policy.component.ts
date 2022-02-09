import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styleUrls: ['./insurance-policy.component.scss'],
})
export class InsurancePolicyComponent implements OnInit {
  insuranceForm: FormGroup;
  responseMessage: string;
  id: string='';

  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
  ) {}
  public countries: any = countries;
  createForm() {
    this.insuranceForm = this._fb.group({
      policyName: ['', [Validators.required]],
      policyNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.insuranceForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.insuranceForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    policyName: '',
    policyNumber: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    policyName: {
      required: 'Policy Name  is Required',
    },
    policyNumber: {
      required: 'Policy Number  is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addinsurance() {
    console.log(this.insuranceForm);

    if (this.insuranceForm.invalid) {
      this.insuranceForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.insuranceForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const insurancePolicytData = {
      country: this.insuranceForm.value.country,
      specifyOwnershipType: this.insuranceForm.value.specifyOwnershipType,
      insurancePolicy: this.insuranceForm.value,
      type: 'insurancePolicy',
    };
    this._userServ.addAssets(insurancePolicytData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.insuranceForm.reset();

        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  onUpdateInsurancePolicy(){
    this.spinner.start();
    const insurancePolicytData = {
      country: this.insuranceForm.value.country,
      specifyOwnershipType: this.insuranceForm.value.specifyOwnershipType,
      insurancePolicy: this.insuranceForm.value,
      type: 'insurancePolicy',
    };
    this._userServ.updateAssets(insurancePolicytData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.insuranceForm.reset();
        this._route.navigate(['/assets']);
      }
     
      this.toastr.message(result.message, result.success);
    });
  }
  getdata(id){
    this._userServ.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);
      
      const data=result.data.filter((item,i)=>{
        if (item._id===id) {
          const {insurancePolicy,country,specifyOwnershipType} = item;
          this.insuranceForm.patchValue({
            policyName: insurancePolicy.policyName,
            policyNumber: insurancePolicy.policyNumber,
            country: country,
            specifyOwnershipType: specifyOwnershipType,
          })     
          return insurancePolicy;
        }
        return null;
      })
      console.log(data);
      

     
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({id})=>{
      if (id) {
        this.id=id;
        this.getdata(id);
      }
    })
    this.createForm();
  }
}
