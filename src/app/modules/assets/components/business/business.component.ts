import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit {
  businessForm: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';
  id: string = '';
  fromCreateWill: string;
  memberData = [];
  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  assetsBeneficiary = [];
  assetsResidualType;
  previousRoute: string;
  toggleModalTutorial: boolean;
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private _route: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,
    private _previousRoute: PreviousRouteService,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {
    this._previousRoute.previousRoute.subscribe((route) => {
      this.previousRoute = route;
    });
  }
  public countries: any = countries;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  GiftBenificiary = [];
  shareData = [];
  createForm() {
    this.businessForm = this._fb.group({
      businessName: ['', [Validators.required]],
      UEN_no: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(20)]],
      country: [, [Validators.required]],
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
    this.spinner.start();
    const businessData = {
      country: this.businessForm.value.country,
      specifyOwnershipType: this.businessForm.value.specifyOwnershipType,
      business: this.businessForm.value,
      type: 'business',
      GiftBenificiary: this.businessForm.value.GiftBenificiary,
      ifBenificiaryNotSurvive: this.assetsResidualType,
    };
    this.assetsServices.addAssets(businessData).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success) {
          this.businessForm.reset();
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
      },
      (err) => {
        this.toastr.message(errorHandler(err), false);
        this.spinner.stop();
      }
    );
  }
  addSharesMember(value) {
    console.log(value);

    this.assetsBeneficiary = value.map((el) => {
      return { ...el, type: 'business' };
    });
    console.log(this.assetsBeneficiary);
  }
  onUpdateBusiness() {
    this.spinner.start();
    const businessData = {
      country: this.businessForm.value.country,
      specifyOwnershipType: this.businessForm.value.specifyOwnershipType,
      business: this.businessForm.value,
      type: 'business',
    };
    this.assetsServices.updateAssets(businessData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem=this.allAssetsBeneficiary.findIndex((el)=>el.type==='business');
          if (myItem===-1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary=this.allAssetsBeneficiary.filter((el)=>el.type !=='business');
            this.allAssetsBeneficiary=[...this.allAssetsBeneficiary,...this.assetsBeneficiary]
          }
          console.log(this.allAssetsBeneficiary);
          
          this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          this.businessForm.reset();
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
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        console.log(result);

        const data = result.data.filter((item, i) => {
          if (item._id === id) {
            const { business, country, specifyOwnershipType } = item;
            this.businessForm.patchValue({
              businessName: business.businessName,
              UEN_no: business.UEN_no,
              country: country,
              specifyOwnershipType: specifyOwnershipType,
            });
            return business;
          }
          return null;
        });
        console.log(data);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  ngOnInit(): void {
    console.log(this.previousRoute);
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      console.log('assetsBeneficiary', value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) => el.type === 'business'
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
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship:
              this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this.createForm();
  }
}
