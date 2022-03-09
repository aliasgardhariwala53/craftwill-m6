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
  selector: 'app-safe-deposit-box',
  templateUrl: './safe-deposit-box.component.html',
  styleUrls: ['./safe-deposit-box.component.scss'],
})
export class SafeDepositBoxComponent implements OnInit {
  id: string = '';
  fromCreateWill: string;
  assetsResidualType;
  memberData = [];
  safeDepositboxForm: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';

  toggleModalTutorial: boolean;
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
  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  assetsBeneficiary = [];
  GiftBenificiary = [];
  shareData = [];
  createForm() {
    this.safeDepositboxForm = this._fb.group({
      safe_Box_Location: ['', [Validators.required]],
      safe_No: ['', [Validators.pattern('^[0-9]*$'),Validators.maxLength(20)]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.safeDepositboxForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.safeDepositboxForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    safe_Box_Location: '',
    safe_No: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    safe_Box_Location: {
      required: 'Safe Box Location  is Required',
    },
    safe_No: {
      pattern: 'Only numeric values allowed',
      maxlength: 'Please Enter Valid Number',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addDepositbox() {
    console.log(this.safeDepositboxForm);

    if (this.safeDepositboxForm.invalid) {
      this.safeDepositboxForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.safeDepositboxForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const safeDepositData = {
      country: this.safeDepositboxForm.value.country,
      specifyOwnershipType: this.safeDepositboxForm.value.specifyOwnershipType,
      safeDepositBox: this.safeDepositboxForm.value,
      type: 'safeDepositBox',
    };
    this.assetsServices.addAssets(safeDepositData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.safeDepositboxForm.reset();
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

  onUpdateSafeDepositBox() {
    this.spinner.start();
    const safeDepositData = {
      country: this.safeDepositboxForm.value.country,
      specifyOwnershipType: this.safeDepositboxForm.value.specifyOwnershipType,
      safeDepositBox: this.safeDepositboxForm.value,
      type: 'safeDepositBox',
    };
    this.assetsServices.updateAssets(safeDepositData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem=this.allAssetsBeneficiary.findIndex((el)=>el.type==='safeDepositBox');
          if (myItem===-1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary=this.allAssetsBeneficiary.filter((el)=>el.type !=='safeDepositBox');
            this.allAssetsBeneficiary=[...this.allAssetsBeneficiary,...this.assetsBeneficiary]
          }
          console.log(this.allAssetsBeneficiary);
          
          this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          this.safeDepositboxForm.reset();

          this._route.navigate([this.forwardRouteLink]);
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }
  addSharesMember(value) {
    console.log(value);

    this.assetsBeneficiary = value.map((el) => {
      return { ...el, type: 'safeDepositBox' };
    });
    console.log(this.assetsBeneficiary);
  }
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        console.log(result);

        const data = result.data.filter((item, i) => {
          if (item._id === id) {
            const { safeDepositBox, country, specifyOwnershipType } = item;
            this.safeDepositboxForm.patchValue({
              safe_Box_Location: safeDepositBox.safe_Box_Location,
              safe_No: safeDepositBox.safe_No,
              country,
              specifyOwnershipType,
            });
            return safeDepositBox;
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
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      console.log('assetsBeneficiary', value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) => el.type === 'safeDepositBox'
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
