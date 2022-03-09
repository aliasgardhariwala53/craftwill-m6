import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { filter, pairwise } from 'rxjs';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { shareItemsHandler } from 'src/app/shared/utils/common-function';
import { countries } from 'src/app/shared/utils/countries-store';


@Component({
  selector: 'app-other-assets',
  templateUrl: './other-assets.component.html',
  styleUrls: ['./other-assets.component.scss']
})
export class OtherAssetsComponent implements OnInit {
  Titile: string = 'BankAccount';
  OtherAssetsForm: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';

  previousRoute: string;
  id: string = '';
  previousUrl: string;
  currentUrl: string;
  fromCreateWill: string;
  memberData = [];

  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  assetsResidualType: string;
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
    this.OtherAssetsForm = this._fb.group({
      asset_name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      id_No: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(20)],
      ],
    });
    this.OtherAssetsForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.OtherAssetsForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    asset_name: '',
    id_No: '',
  };

  formErrorMessages = {
    asset_name: {
      required: 'Asset Name is Required',
      pattern: 'Invalid Name',
    },
    id_No: {
      required: 'Id Number is Required',
      maxlength: 'Please Enter Valid Number',
      pattern: 'Only numeric values allowed',
    },
  };
  assetsBeneficiary = [];
  addOtherAssets() {
    console.log(this.OtherAssetsForm);

    if (this.OtherAssetsForm.invalid) {
      this.OtherAssetsForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.OtherAssetsForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const otherAssetsData = {
      otherAssets: this.OtherAssetsForm.value,
      type: 'otherAssets',
    };
    this.assetsServices.addAssets(otherAssetsData).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success) {
          this.OtherAssetsForm.reset();
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
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  addSharesMember(value) {
    console.log(value);
    this.assetsBeneficiary = value.map((el) => {
      return { ...el, assetId: this.id };
    });
    console.log(this.assetsBeneficiary);
  }
  onUpdateOtherAssets() {
    this.spinner.start();
    const otherAssetsData = {
      otherAssets: this.OtherAssetsForm.value,
      type: 'otherAssets',
    };
    this.assetsServices.updateAssets(otherAssetsData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem = this.allAssetsBeneficiary.findIndex(
            (el) => el.assetId === this.id
          );
          if (myItem === -1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            // this.allAssetsBeneficiary= this.allAssetsBeneficiary.map((el)=>{
            //   if(el.assetId===this.id){
            //     return this.assetsBeneficiary
            //   }else{
            //     return el;
            //   }
            // })
            this.allAssetsBeneficiary = this.allAssetsBeneficiary.filter(
              (el) => el.assetId !== this.id
            );
            this.allAssetsBeneficiary = [
              ...this.allAssetsBeneficiary,
              ...this.assetsBeneficiary,
            ];
          }
          console.log(this.allAssetsBeneficiary);

          this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          this.OtherAssetsForm.reset();
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
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { otherAssets,  } = item;
          this.OtherAssetsForm.patchValue({
            asset_name: otherAssets.asset_name,
            id_No: otherAssets.id_No,
          });
          return otherAssets;
        }
        return null;
      });
      // console.log(data);
    });
  }
  ngOnInit(): void {
    this.createForm();
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
        // console.log(this.fromCreateWill);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
    });
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      console.log('assetsBeneficiary', value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) => el.assetId === this.id
      );
    });

    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          // console.log(items);
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
  }
}
