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
  selector: 'app-intellectual-property',
  templateUrl: './intellectual-property.component.html',
  styleUrls: ['./intellectual-property.component.scss'],
})
export class IntellectualPropertyComponent implements OnInit {
  IntellectualPropertyForm: FormGroup;
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';
  totalShareMessage= false;

  id: string = '';
  fromCreateWill: string;
  assetsResidualType;
  toggleModalTutorial: boolean;
  memberData = [];
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
  wid='';
  createForm() {
    this.IntellectualPropertyForm = this._fb.group({
      ip_Name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$'),Validators.maxLength(32)]],
      ip_No: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(20)]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
estimateValue: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)]],
    });
    this.IntellectualPropertyForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.IntellectualPropertyForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    ip_Name: '',
    ip_No: '',
    country: '',
    estimateValue: '',
 specifyOwnershipType: '',
  };

  formErrorMessages = {
    ip_Name: {
      required: 'Ip name  is required.',
      pattern: 'Invalid Ip name',
      maxlength: 'Word limit Exceed..',
    },
    ip_No: {
      pattern: 'Only numeric values allowed',
      maxlength: 'Please enter valid number',
    },
    country: {
      required: 'Country is required.',
    },

    specifyOwnershipType: {
      required: 'Ownership is required.',
    },
    estimateValue: {
      required: 'Estimate value is required.',
      maxlength: 'Please enter valid number',
 pattern: 'Only numeric values allowed',
    },
  };
  addProperty() {
    //console.log(this.IntellectualPropertyForm);

    if (this.IntellectualPropertyForm.invalid) {
      this.IntellectualPropertyForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.IntellectualPropertyForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
        //console.log('invalid');

      return;
    }

    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const intellectualData = {
      country: this.IntellectualPropertyForm.value.country,
      specifyOwnershipType:this.IntellectualPropertyForm.value.specifyOwnershipType,
        estimateValue:this.IntellectualPropertyForm.value.estimateValue,
      intellectualProperty: this.IntellectualPropertyForm.value,
      type: 'intellectualProperty',
    };
    this.assetsServices.addAssets(intellectualData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.IntellectualPropertyForm.reset();
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

  onUpdateIntellectualProperty() {
    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const intellectualData = {
      country: this.IntellectualPropertyForm.value.country,
      specifyOwnershipType:this.IntellectualPropertyForm.value.specifyOwnershipType,
        estimateValue:this.IntellectualPropertyForm.value.estimateValue,
      intellectualProperty: this.IntellectualPropertyForm.value,
      type: 'intellectualProperty',
    };
    this.assetsServices.updateAssets(intellectualData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem = this.allAssetsBeneficiary.findIndex(
            (el) =>el.assetId === this.id
          );
          if (myItem === -1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary = this.allAssetsBeneficiary.filter(
              (el) => el.assetId !== this.id
            );
            this.allAssetsBeneficiary = [
              ...this.allAssetsBeneficiary,
              ...this.assetsBeneficiary,
            ];
          }
          //console.log(this.allAssetsBeneficiary);

          this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
          if (this.wid !== '') {
            this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{wid:this.wid}});
            return;
          }
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
      //console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { intellectualProperty, country, specifyOwnershipType,estimateValue } = item;
          console.log(item);
          
          this.IntellectualPropertyForm.patchValue({
            ip_Name: intellectualProperty.ip_Name,
            ip_No: intellectualProperty.ip_No,
            country: country,
            specifyOwnershipType: specifyOwnershipType,
            estimateValue:estimateValue,
          });
          return intellectualProperty;
        }
        return null;
      });
      //console.log(data);
    });
  }
  addSharesMember(value) {
    //console.log(value);

    this.assetsBeneficiary = value.map((el) => {
      return { ...el, type: 'intellectualProperty' };
    });
    //console.log(this.assetsBeneficiary);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ id, x, y ,wid}) => {
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
        //console.log(this.fromCreateWill);
        this.wid=wid
        //console.log(this.wid);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
      if (y === 'myWill') {
        this.backRouteLink = '/will/myWills';
        this.forwardRouteLink = '/will/myWills';
        this.fromCreateWill = y;
        //console.log(this.fromCreateWill);
      }
    });
    this.memberServices.getMembers().subscribe(
      (result) => {
        // //console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          //console.log(items);

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
        // //console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
      //console.log('assetsBeneficiary', value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
     this.assetsBeneficiary = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
      
    });
    this.createForm();
  }
}
