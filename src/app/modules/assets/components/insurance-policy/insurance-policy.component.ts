import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
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
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';

  id: string = '';
  fromCreateWill: string;
  assetsResidualType;
  toggleModalTutorial: boolean;
  memberData = [];
  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  assetsBeneficiary = [];
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {}
  public countries: any = countries;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];

  GiftBenificiary = [];
  shareData = [];
  createForm() {
    this.insuranceForm = this._fb.group({
      policyName: ['', [Validators.required]],
      policyNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(20)]],
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
      maxlength: 'Please Enter Valid Number',
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
    this.assetsServices.addAssets(insurancePolicytData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.insuranceForm.reset();

          if (this.fromCreateWill === 'will') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'will' },
            });
          } else if (this.fromCreateWill === 'secure') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'secure' },
            });
          } else {
            this._route.navigate(['/assets/assetsuccess']);
          }
        }
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  onUpdateInsurancePolicy() {
    this.spinner.start();
    const insurancePolicytData = {
      country: this.insuranceForm.value.country,
      specifyOwnershipType: this.insuranceForm.value.specifyOwnershipType,
      insurancePolicy: this.insuranceForm.value,
      type: 'insurancePolicy',
    };
    this.assetsServices.updateAssets(insurancePolicytData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem=this.allAssetsBeneficiary.findIndex((el)=>el.type==='insurancePolicy');
          if (myItem===-1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary=this.allAssetsBeneficiary.filter((el)=>el.type !=='insurancePolicy');
            this.allAssetsBeneficiary=[...this.allAssetsBeneficiary,...this.assetsBeneficiary]
          }
          console.log(this.allAssetsBeneficiary);
          
          this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          this.insuranceForm.reset();
          this._route.navigate([this.forwardRouteLink]);
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { insurancePolicy, country, specifyOwnershipType } = item;
          this.insuranceForm.patchValue({
            policyName: insurancePolicy.policyName,
            policyNumber: insurancePolicy.policyNumber,
            country: country,
            specifyOwnershipType: specifyOwnershipType,
          });
          return insurancePolicy;
        }
        return null;
      });
      console.log(data);
    });
  }
  addSharesMember(value) {
    console.log(value);

    this.assetsBeneficiary = value.map((el) => {
      return { ...el, type: 'insurancePolicy' };
    });
    console.log(this.assetsBeneficiary);
  }
  ngOnInit(): void {
    this.createForm();
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      console.log('assetsBeneficiary', value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) => el.type === 'insurancePolicy'
      );
    });
    this.route.queryParams.subscribe(({ id, x, y }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink = '/will/createWill';
          this.forwardRouteLink = '/will/createWill';
        }
      }
      if (y === 'will') {
        this.backRouteLink = '/will/createWill';
        this.forwardRouteLink = '/will/createWill';
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
    });
  }
}
